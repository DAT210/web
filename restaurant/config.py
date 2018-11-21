class Config():
    SECRET_KEY="my-top-secret-key-hush!"

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG=True

class TestConfig(Config):
    TESTING=True

class ProductionConfig(Config):

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,

    'default': DevelopmentConfig
}
