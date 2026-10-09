from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create least-privilege evaluation staff groups; does not assign users.'

    def handle(self, *args, **options):
        common = ['view_evaluationrequest', 'change_evaluationrequest', 'view_evaluationsubject', 'change_evaluationsubject', 'view_evaluationcourse', 'view_evaluationcurriculum', 'view_evaluationcampus', 'view_evaluationcapacity']
        for name, extra in [('BSCA Evaluation Advisers', ['review_evaluation']), ('BSCA Evaluation Chairpersons', ['decide_evaluation', 'add_evaluationcapacity', 'change_evaluationcapacity'])]:
            group, _ = Group.objects.get_or_create(name=name)
            group.permissions.set(Permission.objects.filter(content_type__app_label='academics', codename__in=common + extra))
            self.stdout.write(self.style.SUCCESS(f'Configured {name}. Assign staff users through Django admin.'))
