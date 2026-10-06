from django.db import migrations, models

# Editorial paraphrases of department-supplied titles, not verified impact statements.
EXPLANATIONS = {'gakit': ('Aims to bring geohazard assessment and related knowledge together in one tool, helping '
           'people understand hazards associated with the ground and landscape.',
           ''),
 'zcharmc': ('Studies a zeolite and biochar material for capturing carbon dioxide and converting '
             'it through a process that forms minerals. The focus is on methods for carbon capture '
             'and conversion.',
             ''),
 'smart-g-id': ('Aims to create an online system for recording goat profiles and enabling farmers '
                'to trade directly with consumers.',
                'Goat farmers and consumers'),
 'aphids-detection': ('Aims to use connected devices to detect damage caused by aphids, small '
                      'insects that attack plants, on bell pepper farms in Northern Mindanao.',
                      'Bell pepper farmers in Northern Mindanao'),
 'sign-language-translation': ('Aims to develop a system that translates between sign language and '
                               'spoken voice in both directions, addressing communication between '
                               'Deaf and non-deaf people.',
                               'Deaf and non-deaf communities'),
 'liquid-vending': ('Aims to develop a machine that dispenses liquids with adjustable '
                    'concentration and accepts both coins and digital payments.',
                    'Users of liquid vending machines'),
 'rfid-laboratory-equipment': ('Aims to use radio-frequency identification (RFID) tags to monitor '
                               'laboratory equipment, supporting the task of keeping track of '
                               'items.',
                               'People responsible for laboratory equipment'),
 'municipal-website-accessibility': ('Examines how accessible municipal websites in Northern '
                                     'Mindanao are, focusing on whether people can use the '
                                     'information and services online.',
                                     'Municipal website users, including people with disabilities'),
 'my-boardhub': ('Aims to develop an information system for managing boarding houses, bringing '
                 'management information into a digital system.',
                 'Boarding-house managers'),
 'asean-digital-transformation': ('Reviews research on digital transformation in public services '
                                  'and doing business across the Association of Southeast Asian '
                                  'Nations (ASEAN). The focus is on understanding the available '
                                  'evidence.',
                                  ''),
 'reversed-vending': ('Aims to develop a machine that receives waste items and connects their '
                      'return with rewards, addressing waste management on campus.',
                      'People participating in campus waste management'),
 'weapon-surveillance': ('Studies computer-based image detection for identifying weapons in campus '
                         'surveillance, with campus safety as its intended focus.',
                         'Campus safety personnel'),
 'smart-campus-survey': ('Surveys how smart campuses are defined, how they are organised and how '
                         'they are put into practice, helping readers compare approaches to using '
                         'technology on campus.',
                         ''),
 'rice-irrigation-monitoring': ('Aims to monitor water levels and soil moisture and use that '
                                'information to schedule irrigation for rice farming.',
                                'Rice farmers'),
 'emerging-technology-prototypes': ('Aims to develop and explore technology prototypes for local '
                                    'and national problems. The reported title does not identify a '
                                    'particular problem or beneficiary group.',
                                    '')}


def add_explanations(apps, schema_editor):
    Project = apps.get_model("research", "ResearchProject")
    for slug, (summary, audience) in EXPLANATIONS.items():
        # Do not replace department edits or create projects absent from the source.
        Project.objects.using(schema_editor.connection.alias).filter(slug=slug, plain_language_summary="").update(plain_language_summary=summary)
        if audience:
            Project.objects.using(schema_editor.connection.alias).filter(slug=slug, intended_audience="").update(intended_audience=audience)


class Migration(migrations.Migration):
    dependencies = [("research", "0006_department_publications")]
    operations = [
        migrations.AddField(model_name="researchproject", name="plain_language_summary", field=models.TextField(blank=True, help_text="Explain the intended focus in everyday language. Do not claim completed work or measured outcomes without evidence.")),
        migrations.AddField(model_name="researchproject", name="intended_audience", field=models.CharField(blank=True, max_length=255, help_text="Intended users or audience supported by the source. Leave blank when not established; not a count of people reached.")),
        migrations.RunPython(add_explanations, migrations.RunPython.noop),
    ]
