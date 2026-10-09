# Department organization and website access

The department organization is managed in Django admin under Department roles,
linked to the existing Faculty members personnel records. A published role only
appears publicly while its personnel record is published and actively affiliated.
Contact details are read from that record, so they do not need separate edits on
the organization and contact pages. Chairperson is a department role separate
from academic rank. Staff records use the existing academic staff and laboratory
personnel directory classifications.

User-supplied organization:

- Paul Rodolf P. Castor — Department chairperson; paulrodolf.castor@g.msuiit.edu.ph
- Cendy Lou O. Odvina — Department administrative aide; cendylou.odvina@g.msuiit.edu.ph
- Allan P. Bicada — Laboratory technician; allan.bicada@g.msuiit.edu.ph
- Kristian Kirk L. Origenes — Laboratory technician; kristiankirk.origenes@g.msuiit.edu.ph

Public personnel and organization entries do not create Django login accounts
and do not grant permissions. No accounts or access assignments are created by
the organization migrations.

Recommended access, if these individuals will operate the website:

- Chairperson: individual staff account with department configuration, approved
  content and alumni review permissions as needed. The existing transfer
  evaluation Chairperson group controls final admissions decisions separately.
- Administrative aide: individual staff account limited to assigned content,
  office records and, if authorized, alumni administration. Do not grant
  admissions decisions, user management, or all-site superuser access by default.
- Laboratory technicians: accounts only if they manage laboratory/facility
  content; grant only relevant model permissions. Laboratory support duties
  alone do not require access to private alumni or student records.

Before granting access, confirm the specific tasks and existing accounts to avoid
duplicates. Use Django groups and model permissions with each person's own
credentials. Maintain a separate technical superuser for site administration.
