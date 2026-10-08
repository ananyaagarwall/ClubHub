# Import all models here so Alembic can discover them for autogenerate
from app.db.session import Base  # noqa: F401
from app.models.institution import College, Department  # noqa: F401
from app.models.club import Club  # noqa: F401
from app.models.user import User, UserProfile  # noqa: F401
from app.models.membership import JoinRequest, Membership, CommitteeTerm  # noqa: F401
from app.models.event import Event, EventStage  # noqa: F401
from app.models.document import Document  # noqa: F401
from app.models.finance import Budget, Expense, Income  # noqa: F401
from app.models.media import Album, Photo  # noqa: F401
from app.models.meeting import Meeting, AgendaItem, Decision, Task  # noqa: F401
from app.models.content import ContentPlan, PostEntry  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.audit import ActivityLog  # noqa: F401
