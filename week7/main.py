# -*- coding:utf-8 -*-
"""
13331093
黄雄镖
默认端口8888
http://localhost:8888/

Python:2.7.8
Tornado:4.1
IDE:Pycharm
"""
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os
import os.path



class FilmHandler(tornado.web.RequestHandler):
    def get(self):
        film = self.get_argument("film", default="tmnt")+"/"
        path = "moviefiles/"+film
        loc = os.path.join(os.path.dirname(__file__), path)
        filelist = os.listdir(path)
        commentlist = [loc+i for i in filelist if i[0] == 'r']
        comment = [[i.strip('\n') for i in open(c).readlines()] for c in commentlist]
        info = [i.strip('\n') for i in open(loc+"info.txt").readlines()]
        generaloverview = [i.strip('\n').split(":") for i in open(loc+"generaloverview.txt").readlines()]
        rof = "freshbig.png" if float(info[2]) > 60 else "rottenbig.png"
        self.render(
            "skeleton.html",
            name=film,
            generaloverview=generaloverview,
            info=info,
            comments=comment,
            rof=rof,
        )


settings = {
    "cookie_secret": "dqoETzxxfrGaYdkL5gEmT4YXAwYh7A4np2X1y5c7/V3=",
    "static_path": os.path.join(os.path.dirname(__file__), "moviefiles"),
    "template_path": os.path.join(os.path.dirname(__file__), 'templates'),
    "debug": True,
}

application = tornado.web.Application([
    (r"/", FilmHandler),
    (r"/", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    ], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()