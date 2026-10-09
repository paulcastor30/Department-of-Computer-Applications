"""Deterministic readers for the two supplied MSU-IIT evaluation exports.

Coordinates are transformed to PDF page space before assigning table cells.
No grade is inferred from a title, GPA, graph, or another subject attempt.
"""
import io
import re
from pypdf import PdfReader

CODE = re.compile(r'^[A-Z][A-Z &/.-]*[ -]?\d+(?:\.\d+)?[A-Z0-9.-]*$')
GRADE = re.compile(r'^(?:[1-5](?:\.\d{1,2})?|INC\.?|IP|IN PROG(?:RESS)?|P|R|DRP?\.?|WDRW|W|NG|NO GRADE)$', re.I)


def page_spans(page):
    spans = []
    def visitor(text, cm, tm, font, size):
        text = text.strip()
        if not text:
            return
        x = tm[4] * cm[0] + tm[5] * cm[2] + cm[4]
        y = float(page.mediabox.top) - (tm[4] * cm[1] + tm[5] * cm[3] + cm[5])
        spans.append({'text': text, 'x': round(x, 2), 'y': round(y, 2)})
    page.extract_text(visitor_text=visitor)
    return sorted(spans, key=lambda s: (round(s['y'] / 2), s['x']))


def join(spans):
    return re.sub(r'\s+', ' ', ' '.join(s['text'] for s in sorted(spans, key=lambda s: (round(s['y'] / 2), s['x'])))).strip()


def extract_record(data):
    reader = PdfReader(io.BytesIO(data))
    all_spans = [page_spans(page) for page in reader.pages]
    text = '\n'.join(s['text'] for spans in all_spans for s in spans)
    if 'STUDENT EVALUATION' in text and 'COURSE NO.' in text and 'COMP.' in text:
        kind, name = 'department', 'MSU-IIT department evaluation'
    elif 'SubjCode' in text and 'Description' in text and 'My.IIT' in text:
        kind, name = 'myiit', 'My.IIT evaluation of grades'
    else:
        return {'supported': False, 'format': '', 'rows': [], 'issues': [{'message': 'Use the original department evaluation or My.IIT evaluation PDF. This file’s layout could not be recognized.', 'severity': 'error'}], 'metadata': {}, 'pages': len(reader.pages), 'complete': False}
    rows, issues, page_checks = [], [], []
    if kind == 'department':
        expected = {'COURSE NO.': 36, 'DESCRIPTIVE TITLE OF THE COURSE': 108, 'FINAL': 429, 'COMP.': 475}
    else:
        width = float(reader.pages[0].mediabox.width)
        expected = {'SubjCode': width*.06, 'Description': width*.203, 'Grade': width*.8}
    for label, x in expected.items():
        anchors = [s for s in all_spans[0] if s['text'] == label]
        if not anchors or abs(anchors[0]['x']-x) > (5 if kind == 'department' else 8):
            issues.append({'severity': 'error', 'message': 'Table columns differ from the supported original export. Please download the original PDF again.'})
    semester = ''
    metadata = {'school': 'MSU-IIT', 'full_name': '', 'current_program': ''}
    expected_pages = set()
    printed_page_numbers = []
    for page_number, spans in enumerate(all_spans, 1):
        if kind == 'myiit':
            page = reader.pages[page_number-1]
            footer = join([s for s in spans if s['x'] > float(page.mediabox.width)*.9 and s['y'] > float(page.mediabox.height)-25])
            fraction = re.fullmatch(r'(\d+)\s*/\s*(\d+)', footer)
            if fraction:
                printed_page_numbers.append(int(fraction.group(1)))
                expected_pages.add(int(fraction.group(2)))
        for s in spans:
            match = re.search(r'Page No\.\s*:\s*(\d+)', s['text']) if kind == 'department' else re.fullmatch(r'(\d+)\s*/\s*(\d+)', s['text'])
            if match:
                printed_page_numbers.append(int(match.group(1)))
            if match and kind == 'myiit':
                expected_pages.add(int(match.group(2)))
            label = 'Name of Student :' if kind == 'department' else 'Name:'
            if s['text'].startswith(label):
                inline = s['text'][len(label):].strip()
                nearby = [p for p in spans if abs(p['y'] - s['y']) < 2 and p['x'] > s['x'] + 20 and 'Overall GPA' not in p['text'] and not re.fullmatch(r'\d+\.\d+', p['text'])]
                metadata['full_name'] = inline or join(nearby)
            if kind == 'myiit' and s['text'].startswith('Last Course Taken:'):
                metadata['current_program'] = s['text'].split(':', 1)[1].strip() or join([p for p in spans if abs(p['y']-s['y']) < 2 and p['x'] > s['x']+30])
        if kind == 'department':
            # Boundaries in the supplied letter-size monospace report (page units).
            left, title_start, title_end, final_start, comp_start, units_start = 30, 100, 330, 415, 467, 515
            code_end = title_start
        else:
            # The HTML print export uses the same table proportions on each page.
            width = float(reader.pages[page_number-1].mediabox.width)
            left, code_end, title_start, title_end = width*.04, width*.19, width*.19, width*.78
            final_start, comp_start, units_start = width*.78, width, width
        candidates = [s for s in spans if left <= s['x'] < code_end and CODE.fullmatch(s['text'])]
        # Any text in the code column containing a digit and resembling a code
        # must be accounted for, even if the strict code grammar does not accept it.
        suspicious = [s for s in spans if left <= s['x'] < code_end and re.match(r'^[A-Z][A-Z .&/-]*\d', s['text']) and s not in candidates and not s['text'].startswith(('SY:', 'ID', 'First', 'Second', 'Summer'))]
        for s in suspicious:
            issues.append({'page': page_number, 'severity': 'error', 'message': 'An unrecognized subject code needs department review.'})
        boundaries = [s for s in spans if re.match(r'^(First|Second|Summer|Midyear)\s+(Semester|Term)|^SY:', s['text'], re.I) or 'Cumulative GPA:' in s['text'] or s['text'] == 'GPA' or s['text'].startswith(('Date/Time Printed', 'Certified by:'))]
        for candidate_index, code_span in enumerate(candidates):
            y = code_span['y']
            for boundary in boundaries:
                if boundary['y'] <= y and (re.match(r'^(First|Second|Summer|Midyear)\s', boundary['text'], re.I) or boundary['text'].startswith('SY:')):
                    semester = boundary['text']
                    if kind == 'department':
                        major = [s for s in spans if abs(s['y']-boundary['y']) < 2 and 275 <= s['x'] < 365 and s['text'] != 'MAJOR :']
                        if major:
                            metadata['current_program'] = join(major)
            next_y = candidates[candidate_index+1]['y'] if candidate_index+1 < len(candidates) else float('inf')
            stop = min([next_y] + [s['y'] for s in boundaries if s['y'] > y + 2])
            cells = [s for s in spans if y-2 <= s['y'] < stop-1]
            title = join([s for s in cells if title_start <= s['x'] < title_end and s['text'] not in ('Description', 'DESCRIPTIVE TITLE OF THE COURSE')])
            grade_parts = [s for s in spans if abs(s['y']-y) <= 2 and final_start <= s['x'] < comp_start]
            completion_parts = [s for s in spans if abs(s['y']-y) <= 2 and comp_start <= s['x'] < units_start] if kind == 'department' else []
            if kind == 'myiit':
                raw_grade = re.sub(r'[\ue000-\uf8ff]', '', join(grade_parts)).strip()
                bracket = re.search(r'\[\s*([^\]]+)\s*\]', raw_grade)
                completion = bracket.group(1).strip() if bracket else ''
                final = re.sub(r'\[.*?\]', '', raw_grade).strip()
                units = None
            else:
                final, completion = join(grade_parts), join(completion_parts)
                credit_units = join([s for s in spans if abs(s['y']-y) <= 2 and units_start <= s['x'] < 580])
                units = credit_units.strip('() ') or None
            row_issues = []
            if not title:
                row_issues.append('Course title could not be read.')
            if final and not GRADE.fullmatch(final):
                row_issues.append('Grade notation needs adviser verification.')
            if completion:
                if not GRADE.fullmatch(completion):
                    row_issues.append('Completion grade could not be read clearly.')
                else:
                    row_issues.append('Completion grade recorded; adviser must verify the resolved result.')
            if units is not None and not re.fullmatch(r'\d{1,2}(?:\.\d)?', units):
                row_issues.append('Credit units could not be read clearly.')
                units = None
            row = {'record_id': len(rows), 'code': code_span['text'], 'title': title,
                   'units': units, 'grade': completion or final, 'original_grade': final,
                   'completion_grade': completion, 'semester': semester, 'source_page': page_number, 'source_y': y,
                   'requires_review': bool(row_issues), 'source_note': '; '.join(row_issues),
                   'units_kind': 'earned_credit' if kind == 'department' else 'not_shown'}
            rows.append(row)
            for issue in row_issues:
                issues.append({'record_id': row['record_id'], 'page': page_number, 'severity': 'review', 'message': issue})
        chart_page = kind == 'myiit' and any(x in '\n'.join(s['text'] for s in spans) for x in ('Grade Distribution', 'GPA per Semester', 'Cumulative GPA per Semester', 'Visualization')) and not candidates
        certification_page = kind == 'department' and not candidates and any(s['text'] == 'Units Load:' and any(p['text'] == '0' and abs(p['y']-s['y']) < 2 and p['x'] > s['x'] for p in spans) for s in spans) and any('certified by:' in s['text'].lower() for s in spans)
        page_checks.append({'page': page_number, 'subjects': len(candidates), 'kind': 'charts' if chart_page else 'certification' if certification_page else 'academic_record'})
        if not candidates and not chart_page and not certification_page:
            issues.append({'page': page_number, 'severity': 'error', 'message': 'No subject rows were found on an academic-record page.'})
    if printed_page_numbers != list(range(1, len(reader.pages)+1)):
        issues.append({'severity': 'error', 'message': 'Printed page numbers are missing, duplicated or out of order. Upload the complete original export.'})
    if expected_pages and (len(expected_pages) != 1 or len(reader.pages) not in expected_pages):
        issues.append({'severity': 'error', 'message': 'The printed page count does not match the uploaded PDF. Upload the complete export.'})
    if not rows:
        issues.append({'severity': 'error', 'message': 'No subject history was found.'})
    if len(rows) > 400:
        issues.append({'severity': 'error', 'message': 'The record exceeds the supported 400 subject attempts.'})
    return {'supported': True, 'format': name, 'rows': rows, 'issues': issues, 'metadata': metadata,
            'pages': len(reader.pages), 'page_checks': page_checks,
            'complete': bool(rows) and not any(i['severity'] == 'error' for i in issues)}
