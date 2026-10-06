from django.db import migrations, models

# Editorial paraphrases of department-supplied titles, not verified impact statements.
EXPLANATIONS = {'2026-my-comapps-a-technology-development-program-2-0': ('A technology-development extension '
                                                          'program. The reported title identifies '
                                                          'this as version 2.0; contact the '
                                                          'department for its specific activities '
                                                          'and intended participants.',
                                                          ''),
 '2026-my-compapps-osy-techup-community-based-microcontroller-training-for-out-of-school-youth-in-ic': ('Community-based '
                                                                                                        'training '
                                                                                                        'in '
                                                                                                        'microcontrollers, '
                                                                                                        'the '
                                                                                                        'small '
                                                                                                        'computers '
                                                                                                        'used '
                                                                                                        'to '
                                                                                                        'control '
                                                                                                        'electronic '
                                                                                                        'devices, '
                                                                                                        'for '
                                                                                                        'out-of-school '
                                                                                                        'youth.',
                                                                                                        'Out-of-school '
                                                                                                        'youth'),
 '2026-my-quantum-capacitating-quantum-education-for-stem-students': ('An education program '
                                                                      'focused on quantum topics '
                                                                      'for students in science, '
                                                                      'technology, engineering and '
                                                                      'mathematics (STEM).',
                                                                      'STEM students'),
 '2026-techbeyond-bars-digital-transformation-for-jail-officers-and-personnel': ('An extension '
                                                                                 'program focused '
                                                                                 'on digital '
                                                                                 'transformation '
                                                                                 'for jail '
                                                                                 'officers and '
                                                                                 'personnel: '
                                                                                 'changing how '
                                                                                 'work is done '
                                                                                 'with digital '
                                                                                 'technology.',
                                                                                 'Jail officers '
                                                                                 'and personnel'),
 '2026-techbehindbars-digital-reformation-for-pdls': ('An extension program focused on digital '
                                                      'reformation for persons deprived of liberty '
                                                      '(PDLs). Contact the department for the '
                                                      'specific learning activities and '
                                                      'participation arrangements.',
                                                      'Persons deprived of liberty'),
 '2025-aquaguard-iot-enhance-communal-water-filtration-and-storage-using-granulated-activated-carbon-and-anthracite': ('Focuses '
                                                                                                                       'on '
                                                                                                                       'community '
                                                                                                                       'water '
                                                                                                                       'filtration '
                                                                                                                       'and '
                                                                                                                       'storage '
                                                                                                                       'using '
                                                                                                                       'connected '
                                                                                                                       'devices '
                                                                                                                       'and '
                                                                                                                       'two '
                                                                                                                       'filtering '
                                                                                                                       'materials: '
                                                                                                                       'granulated '
                                                                                                                       'activated '
                                                                                                                       'carbon '
                                                                                                                       'and '
                                                                                                                       'anthracite.',
                                                                                                                       'Communities '
                                                                                                                       'using '
                                                                                                                       'communal '
                                                                                                                       'water '
                                                                                                                       'filtration '
                                                                                                                       'and '
                                                                                                                       'storage'),
 '2025-computer-studies-to-conduct-and-implement-an-extension-project-entitled-mycomapps-a-technology-development-program-fostering-meaningful-innovations': ('A '
                                                                                                                                                              'technology-development '
                                                                                                                                                              'extension '
                                                                                                                                                              'program '
                                                                                                                                                              'focused '
                                                                                                                                                              'on '
                                                                                                                                                              'meaningful '
                                                                                                                                                              'innovation. '
                                                                                                                                                              'Contact '
                                                                                                                                                              'the '
                                                                                                                                                              'department '
                                                                                                                                                              'for '
                                                                                                                                                              'its '
                                                                                                                                                              'specific '
                                                                                                                                                              'activities '
                                                                                                                                                              'and '
                                                                                                                                                              'intended '
                                                                                                                                                              'participants.',
                                                                                                                                                              ''),
 '2025-tech-beyond-bars-digital-transformation-for-jail-personnel': ('An extension program focused '
                                                                     'on using digital technology '
                                                                     'to change how jail personnel '
                                                                     'work.',
                                                                     'Jail personnel'),
 '2025-tech-behind-bars-digital-reformation-for-inmates': ('An extension program focused on '
                                                           'digital reformation for inmates. '
                                                           'Contact the department for the '
                                                           'specific learning activities and '
                                                           'participation arrangements.',
                                                           'Inmates'),
 '2024-my-comapps-a-technology-development-program': ('A technology-development extension program. '
                                                      'Contact the department for the activities '
                                                      'and participant groups covered by this '
                                                      'reporting-year record.',
                                                      ''),
 '2023-present-initial-assessment-and-design-of-implementation-of-an-automated-flood-monitoring-and-warning-system-in-sikyop': ('Focuses '
                                                                                                                                'on '
                                                                                                                                'presenting '
                                                                                                                                'an '
                                                                                                                                'initial '
                                                                                                                                'assessment '
                                                                                                                                'and '
                                                                                                                                'implementation '
                                                                                                                                'design '
                                                                                                                                'for '
                                                                                                                                'a '
                                                                                                                                'system '
                                                                                                                                'that '
                                                                                                                                'automatically '
                                                                                                                                'monitors '
                                                                                                                                'flooding '
                                                                                                                                'and '
                                                                                                                                'provides '
                                                                                                                                'warnings '
                                                                                                                                'in '
                                                                                                                                'Sikyop.',
                                                                                                                                'The '
                                                                                                                                'Sikyop '
                                                                                                                                'community'),
 '2023-automated-flood-monitoring-and-warning-system-in-sikyop': ('Focuses on an automated system '
                                                                  'for monitoring flooding and '
                                                                  'providing warnings in Sikyop.',
                                                                  'The Sikyop community'),
 '2023-development-and-deployment-of-e-vending-machine-with-real-time-sale-monitoring-system': ('Focuses '
                                                                                                'on '
                                                                                                'an '
                                                                                                'electronic '
                                                                                                'vending '
                                                                                                'machine '
                                                                                                'with '
                                                                                                'a '
                                                                                                'system '
                                                                                                'for '
                                                                                                'tracking '
                                                                                                'sales '
                                                                                                'as '
                                                                                                'they '
                                                                                                'happen.',
                                                                                                'Vending-machine '
                                                                                                'operators')}


def add_explanations(apps, schema_editor):
    Project = apps.get_model("extension", "ExtensionProject")
    for slug, (summary, audience) in EXPLANATIONS.items():
        # Do not replace department edits or create projects absent from the source.
        Project.objects.using(schema_editor.connection.alias).filter(slug=slug, plain_language_summary="").update(plain_language_summary=summary)
        if audience:
            Project.objects.using(schema_editor.connection.alias).filter(slug=slug, intended_audience="").update(intended_audience=audience)


class Migration(migrations.Migration):
    dependencies = [("extension", "0002_department_extension")]
    operations = [
        migrations.AddField(model_name="extensionproject", name="plain_language_summary", field=models.TextField(blank=True, help_text="Explain the intended focus in everyday language. Do not claim completed work or measured outcomes without evidence.")),
        migrations.AddField(model_name="extensionproject", name="intended_audience", field=models.CharField(blank=True, max_length=255, help_text="Intended users or audience supported by the source. Leave blank when not established; not a count of people reached.")),
        migrations.RunPython(add_explanations, migrations.RunPython.noop),
    ]
