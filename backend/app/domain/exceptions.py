"""
Domain-specific exceptions for CyberTrace AI business logic.
Services raise these domain exceptions rather than HTTP-specific exceptions.
"""

class CyberTraceDomainException(Exception):
    """Base domain exception."""
    def __init__(self, message: str, code: str = "DOMAIN_ERROR"):
        super().__init__(message)
        self.message = message
        self.code = code


class ComplaintNotFoundException(CyberTraceDomainException):
    def __init__(self, complaint_id: str):
        super().__init__(f"Complaint '{complaint_id}' was not found in the intelligence registry.", code="COMPLAINT_NOT_FOUND")
        self.complaint_id = complaint_id


class UnauthorizedRoleException(CyberTraceDomainException):
    def __init__(self, required_role: str, actual_role: str):
        super().__init__(f"Action requires role '{required_role}', but current user has '{actual_role}'.", code="UNAUTHORIZED_ROLE")


class EvidenceTamperedException(CyberTraceDomainException):
    def __init__(self, evidence_id: str, expected_hash: str, actual_hash: str):
        super().__init__(
            f"Evidence '{evidence_id}' failed SHA-256 seal integrity check. Expected: {expected_hash}, Actual: {actual_hash}",
            code="EVIDENCE_TAMPERED"
        )


class InvalidMuleChainException(CyberTraceDomainException):
    def __init__(self, details: str):
        super().__init__(f"Invalid transaction chain structure: {details}", code="INVALID_MULE_CHAIN")
