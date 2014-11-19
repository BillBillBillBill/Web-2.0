# -*- coding:utf-8 -*-
"""
13331093
黄雄镖
已实现所有额外功能(返回链接,支持真正的.m3u播放列表文件,随机顺序,按大小排序)
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
import random


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class MainHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.redirect("/music")
        # self.render("index.html")

class MusicModule(tornado.web.UIModule):
    def render(self, musics, playlist, picklist):
        return self.render_string('modules/music.html', musics=musics, playlist=playlist, picklist=picklist)


class MusicHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        arg = "?"
        Shuffle = self.get_argument("shuffle", default=False)
        playlist = self.get_argument("playlist", default="")
        bysize = self.get_argument("bysize", default=False)
        dir = os.path.join(os.path.dirname(__file__), "file/songs/")
        path = "file/songs"
        deb = os.listdir(path)
        musiclist = ["static/songs/"+i for i in deb]
        musicsize = [os.path.getsize(dir+i) for i in deb]
        music = zip(musiclist, musicsize)
        if playlist:
            arg += "playlist="+playlist+"&"
            mylist = []
            picklist = [i.strip('\n') for i in open(dir+playlist).readlines() if i[0] != '#']
        else:
            mylist = ["mypicks.m3u", "playlist.m3u"]
            picklist = deb
        if Shuffle:
            random.shuffle(music)
        if bysize:
            music.sort(key=lambda x: x[1], reverse=True)

        self.render(
            "music.html",
            musics=music,
            playlist=mylist,
            picklist=picklist,
            arg=arg,
        )


settings = {
    "cookie_secret": "dqoETzxxfrGaYdkL5gEmT4YXAwYh7A4np2X1y5c7/V3=",
    "static_path": os.path.join(os.path.dirname(__file__), "file"),
    "ui_modules": {'Music': MusicModule},
    "template_path": os.path.join(os.path.dirname(__file__), 'templates'),
    "debug": True,
}

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/music", MusicHandler),
    (r"/", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()