"""Import the department-supplied 2026 faculty workbook and verified institutional emails."""
from django.db import migrations

PROFILES = [{'education': [{'degree_level': 'doctorate',
                 'degree_name': 'PhD in Artificial Intelligence of Things',
                 'institution': 'National Taiwan University and Academia Sinica',
                 'notes': 'Ongoing study; degree not yet completed.',
                 'year_completed': None},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2020},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Embedded Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2017}],
  'email': 'applerose.alce@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor IV',
  'profile_summary': 'Apple Rose B. Alce is listed as Assistant Professor IV in the department’s 2026 '
                     'faculty profile. Specialization areas include Embedded Systems, Internet of Things '
                     '(IoT), Machine Learning (ML), Artificial Intelligence of Things (AIoT).',
  'slug': 'apple-rose-b-alce',
  'specialization_areas': 'Embedded Systems, Internet of Things (IoT), Machine Learning (ML), Artificial '
                          'Intelligence of Things (AIoT)',
  'title': 'Apple Rose B. Alce'},
 {'education': [{'degree_level': 'doctorate',
                 'degree_name': 'Doctor of Engineering in Mechanical Engineering',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2020},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2013},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Computer Engineering',
                 'institution': 'St. Peter’s College',
                 'notes': '',
                 'year_completed': 1999}],
  'email': 'leah.alindayo@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Doctoral Degree',
  'position': 'Associate Professor V',
  'profile_summary': 'Leah A. Alindayo is listed as Associate Professor V in the department’s 2026 faculty '
                     'profile. Specialization areas include Artificial Intelligence,Robotics, Embedded '
                     'Systems, Digital Signal Processing.',
  'slug': 'leah-a-alindayo',
  'specialization_areas': 'Artificial Intelligence,Robotics, Embedded Systems, Digital Signal Processing',
  'title': 'Leah A. Alindayo'},
 {'education': [{'degree_level': 'doctorate',
                 'degree_name': 'Doctor in Information Technology',
                 'institution': 'University of Southern Philippines',
                 'notes': 'Completion status to be validated by the Department.',
                 'year_completed': None},
                {'degree_level': 'doctorate',
                 'degree_name': 'Doctor of Engineering in Mechanical Engineering',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': 'Completion status to be validated by the Department.',
                 'year_completed': None},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Information Technology',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2009},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Communications Engineering',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 1995}],
  'email': 'mariafe.bahinting@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Associate Professor V',
  'profile_summary': 'Maria Fe P. Bahinting is listed as Associate Professor V in the department’s 2026 '
                     'faculty profile. Specialization areas include Robotics, Computer Vision, Artificial '
                     'Intelligence.',
  'slug': 'maria-fe-p-bahinting',
  'specialization_areas': 'Robotics, Computer Vision, Artificial Intelligence',
  'title': 'Maria Fe P. Bahinting'},
 {'education': [{'degree_level': 'doctorate',
                 'degree_name': 'Doctor of Information Technology',
                 'institution': 'Cebu Institute of Technology - University',
                 'notes': 'Ongoing study; degree not yet completed.',
                 'year_completed': None},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2021},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Information Technology, Major in Database Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2018},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Engineering Technology Management',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2014}],
  'email': 'stefanymae.caparida@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor III',
  'profile_summary': 'Stefany Mae V. Caparida is listed as Assistant Professor III in the department’s 2026 '
                     'faculty profile. Specialization areas include Computer Programming, Technopreneurship, '
                     'Introduction to Quantum Technology.',
  'slug': 'stefany-mae-v-caparida',
  'specialization_areas': 'Computer Programming, Technopreneurship, Introduction to Quantum Technology',
  'title': 'Stefany Mae V. Caparida'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2023},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Industrial Automation and Mechatronics',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2019},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Embedded Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2018}],
  'email': 'paulrodolf.castor@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor III',
  'profile_summary': 'Paul Rodolf P. Castor is listed as Assistant Professor III in the department’s 2026 '
                     'faculty profile. Specialization areas include Edge Computing, Artificial Intelligence, '
                     'Internet of Things, Mechatronics, Networked Sensing Systems.',
  'slug': 'paul-rodolf-p-castor',
  'specialization_areas': 'Edge Computing, Artificial Intelligence, Internet of Things, Mechatronics, '
                          'Networked Sensing Systems',
  'title': 'Paul Rodolf P. Castor'},
 {'education': [{'degree_level': 'doctorate',
                 'degree_name': 'Doctor of Philosophy in Energy Engineering',
                 'institution': 'University of Science and Technology of Southern Philippines',
                 'notes': 'Completion status to be validated by the Department.',
                 'year_completed': None},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Engineering',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2024},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Communications Engineering',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 1999}],
  'email': 'jerry.halibas@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor IV',
  'profile_summary': 'Jerry B. Halibas is listed as Assistant Professor IV in the department’s 2026 faculty '
                     'profile. Specialization areas include Computer Vision, IOT, Embedded, Process Control '
                     'Instrumentation, Process Automation.',
  'slug': 'jerry-b-halibas',
  'specialization_areas': 'Computer Vision, IOT, Embedded, Process Control Instrumentation, Process '
                          'Automation',
  'title': 'Jerry B. Halibas'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2023},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Communications Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2019}],
  'email': 'excelvan.jondonero@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor III',
  'profile_summary': 'Excel Van O. Jondonero is listed as Assistant Professor III in the department’s 2026 '
                     'faculty profile. Specialization areas include Computer Vision, Internet of Things, '
                     'Embedded Systems.',
  'slug': 'excel-van-o-jondonero',
  'specialization_areas': 'Computer Vision, Internet of Things, Embedded Systems',
  'title': 'Excel Van O. Jondonero'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Teaching Technology',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 1996},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics Engineering, Major in Industrial '
                                'Electronics',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 1986}],
  'email': 'antonio.marajas@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Professor III',
  'profile_summary': 'Antonio S. Marajas is listed as Professor III in the department’s 2026 faculty '
                     'profile. Specialization areas include Industrial Electronics.',
  'slug': 'antonio-s-marajas',
  'specialization_areas': 'Industrial Electronics',
  'title': 'Antonio S. Marajas'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2023},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Communications Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2019}],
  'email': 'juffil.papolonias@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Instructor II',
  'profile_summary': 'Juffil B. Papolonias is listed as Instructor II in the department’s 2026 faculty '
                     'profile. Specialization areas include Machine Learning, Internet of Things, & Embedded '
                     'Systems.',
  'slug': 'juffil-b-papolonias',
  'specialization_areas': 'Machine Learning, Internet of Things, & Embedded Systems',
  'title': 'Juffil B. Papolonias'},
 {'education': [{'degree_level': 'doctorate',
                 'degree_name': 'Doctor of Information Technology',
                 'institution': 'St. Paul University',
                 'notes': 'Completion status to be validated by the Department.',
                 'year_completed': None},
                {'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2020},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Embedded Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2015}],
  'email': 'phoeberuthalithea.sudaria@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor IV',
  'profile_summary': 'Phoebe Ruth Alithea B. Sudaria is listed as Assistant Professor IV in the department’s '
                     '2026 faculty profile. Specialization areas include Embedded Systems, IoT, Hardware '
                     'Implementation.',
  'slug': 'phoebe-ruth-alithea-b-sudaria',
  'specialization_areas': 'Embedded Systems, IoT, Hardware Implementation',
  'title': 'Phoebe Ruth Alithea B. Sudaria'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2023},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Electronics and Computer Technology, Major in '
                                'Communications Systems',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2019}],
  'email': 'jomarifrancis.villanueva@g.msuiit.edu.ph',
  'faculty_category': 'Core faculty',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Professor III',
  'profile_summary': 'Jomari Francis B. Villanueva is listed as Assistant Professor III in the department’s '
                     '2026 faculty profile. Specialization areas include Internet of Things, Machine '
                     'Learning, Embedded Programming.',
  'slug': 'jomari-francis-b-villanueva',
  'specialization_areas': 'Internet of Things, Machine Learning, Embedded Programming',
  'title': 'Jomari Francis B. Villanueva'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2026},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2024}],
  'email': 'leonhel.fortin@g.msuiit.edu.ph',
  'faculty_category': 'Lecturer',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Lecturer',
  'profile_summary': 'Leonhel V. Fortin is listed as Assistant Lecturer in the department’s 2026 faculty '
                     'profile. Specialization areas include Embedded machine learning and computer vision, '
                     'Internet of Things and AIoT systems development, data analytics.',
  'slug': 'leonhel-v-fortin',
  'specialization_areas': 'Embedded machine learning and computer vision, Internet of Things and AIoT '
                          'systems development, data analytics',
  'title': 'Leonhel V. Fortin'},
 {'education': [{'degree_level': 'masters',
                 'degree_name': 'Master of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2024},
                {'degree_level': 'bachelors',
                 'degree_name': 'Bachelor of Science in Computer Applications',
                 'institution': 'MSU - Iligan Institute of Technology',
                 'notes': '',
                 'year_completed': 2022}],
  'email': 'collienprincess.pepito@g.msuiit.edu.ph',
  'faculty_category': 'Lecturer',
  'highest_degree': 'Master’s Degree',
  'position': 'Assistant Lecturer',
  'profile_summary': 'Collien Princess C. Pepito is listed as Assistant Lecturer in the department’s 2026 '
                     'faculty profile. Specialization areas include Embedded Systems, IoT, Artificial '
                     'Intelligence.',
  'slug': 'collien-princess-c-pepito',
  'specialization_areas': 'Embedded Systems, IoT, Artificial Intelligence',
  'title': 'Collien Princess C. Pepito'}]


def import_profiles(apps, schema_editor):
    Faculty = apps.get_model("people", "FacultyMember")
    Education = apps.get_model("people", "FacultyEducation")
    alias = schema_editor.connection.alias
    for index, source in enumerate(PROFILES):
        data = {key: value for key, value in source.items() if key != "education"}
        existing = Faculty.objects.using(alias).filter(email=source["email"]).first()
        if existing is None:
            existing = Faculty.objects.using(alias).filter(slug=source["slug"]).first()
        if existing is None:
            # Existing profiles may use honorifics or surname-first names.
            surname = source["title"].split()[-1]
            candidates = list(Faculty.objects.using(alias).filter(title__icontains=surname))
            if len(candidates) == 1:
                existing = candidates[0]
        data.update(last_updated_note="Faculty information supplied by the Department, 2026. Website updated 5 October 2026.", sort_order=index)
        if existing is None:
            existing = Faculty.objects.using(alias).create(**data, is_published=True,
                personnel_type="faculty", service_classification="active_dca_faculty")
        else:
            # Keep existing links, photos, publication state, service status and other professional records.
            data.pop("slug")
            Faculty.objects.using(alias).filter(pk=existing.pk).update(**data)
        for order, education in enumerate(source["education"]):
            Education.objects.using(alias).update_or_create(faculty_id=existing.pk,
                degree_name=education["degree_name"], institution=education["institution"],
                defaults={**education, "sort_order":order, "is_published":True})


class Migration(migrations.Migration):
    dependencies = [("people", "0003_facultymember_active_affiliation_and_more")]
    operations = [migrations.RunPython(import_profiles, migrations.RunPython.noop)]
