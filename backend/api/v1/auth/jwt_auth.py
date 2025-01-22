from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta
from flask import jsonify, request
from models.user import User
from models import storage
from api.v1.auth.auth import Auth


class JWTAuth(Auth):
    def __init__(self, app=None, secret_key=None, token_expires_in_minutes=30):
        """
        Initialize the JWTAuth class.

        :param app: Flask app instance (optional)
        :param secret_key: Secret key for JWT signing
        :param token_expires_in_minutes: Token expiration time in minutes
        """
        self.jwt = None
        self.secret_key = secret_key
        self.token_expires_in_minutes = token_expires_in_minutes

        if app:
            self.init_app(app)

    def init_app(self, app):
        """
        Initialize JWTManager with the Flask app.

        :param app: Flask app instance
        """
        app.config["JWT_SECRET_KEY"] = self.secret_key
        app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=self.token_expires_in_minutes)
        self.jwt = JWTManager(app)

    def create_token(self, identity):
        """
        Create a JWT token for a given identity (e.g., user ID or username).

        :param identity: The identity to include in the token
        :return: A JWT token string
        """
        return create_access_token(identity=identity)

    def current_user(self, request=None):
        """
        Retrieve the identity of the current user from the JWT token.

        :return: The identity of the user
        """
        dictt = {}
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        if current_user is None:
            return None
        
        dictt["email"] = current_user

        user_exist = storage.search(User, dictt)
        
        if not user_exist:
            return None
        for user in user_exist:
            user_id = user.id
        
        user_instance = storage.get(User, user_id)

        if user_instance is None:
            return None
        else:
            return user_instance

    def jwt_required_decorator(self, func):
        """
        Wrapper for @jwt_required decorator to protect a route.

        :param func: The route function to protect
        :return: Wrapped function
        """
        @jwt_required()
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        return wrapper

    def verify_request(self):
        """
        Verify the JWT token in the request headers dynamically.

        :return: Tuple (identity, error message)
        """
        try:
            verify_jwt_in_request()
            identity = self.get_identity()
            return identity, None
        except Exception as e:
            return None, str(e)
