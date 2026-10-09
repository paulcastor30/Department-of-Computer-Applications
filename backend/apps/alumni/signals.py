from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import AlumniProfile, AlumniEmailLink, AlumniUpdateSession


@receiver(post_delete, sender=AlumniProfile)
def revoke_deleted_profile_access(sender, instance, using, **kwargs):
    AlumniEmailLink.objects.using(using).filter(email=instance.email).delete()
    AlumniUpdateSession.objects.using(using).filter(email=instance.email).delete()
