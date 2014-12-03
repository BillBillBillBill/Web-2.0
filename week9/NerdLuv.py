#coding:utf-8
"""
13331093
黄雄镖

已实现所有额外功能:
服务器端表单验证
上传照片
再次登陆的用户查看他们的匹配者
Person类设计
增加补充要求

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
from tornado.options import options
import os
import os.path

options.define("port", default=8888, help="run on the given port", type=int)

class people(object):

    def __init__(self, information, imagepath="images/default_user.jpg"):
        self.information = information
        self.name = information[0]
        self.sex = information[1]
        self.age = information[2]
        self.pt = information[3]
        self.OS = information[4]
        self.seek = information[5]
        self.fromAge = information[6]
        self.toAge = information[7]
        self.rate = 0
        self.imagepath = imagepath
        self.error_msg = ""

    def get_match_list(self):
        read = open('files/singles.txt', 'a+')
        record = read.read()
        read.close()
        match_list = [i.split(",") for i in record.split("\n")]
        path = "files/images"
        filelist = os.listdir(path)
        match_list = [people(i, "images/"+i[0].lower().replace(" ", "_")+".jpg" if i[0].lower().replace(" ", "_")+".jpg" in filelist else "images/default_user.jpg") for i in match_list]
        match_list = self.people_filter(match_list)
        return match_list

    def people_filter(self, match_list):
        matched_list = []
        for person in match_list:
            if self.fromAge <= person.age <= self.toAge and person.fromAge <= self.age <= person.toAge:
                person.rate += 1
            if self.OS == person.OS:
                person.rate += 2
            person.rate += len(set(person.pt) & set(self.pt))
            if person.name == self.name or person.seek.find(self.sex) == -1 or self.seek.find(person.sex) == -1 or person.rate < 3:
                continue
            matched_list.append(person)
        return matched_list

    def write_to_file(self, request=""):
        exist = False
        read = open('files/singles.txt', 'a+')
        record = read.read()
        if record.find(self.name) != -1:
            exist = True
        read.close()
        if not exist:
            read = open('files/singles.txt', 'a+')
            read.write("\n"+",".join(self.information))
            read.close()
            if request:
                imgfile = request
                filename = self.name.lower().replace(" ", "_")+"."+imgfile["filename"].split(".")[-1]
                f = open("files/images/%s" % filename, "wb")
                f.write(imgfile["body"])
                f.close()

    def isvalid(self):
        try:
            Os = ["Windows", "Mac OS X", "Linux", "other"]
            valid_information = [
                all([0 <= int(age) <= 99 for age in [self.age, self.fromAge, self.toAge]]),
                all(self.information),
                self.sex == "M" or self.sex == "F",
                len(self.pt) == 4,
                self.pt[0] == "I" or self.pt[0] == "E",
                self.pt[1] == "N" or self.pt[1] == "S",
                self.pt[2] == "F" or self.pt[2] == "T",
                self.pt[3] == "J" or self.pt[3] == "P",
                self.OS in Os,
                self.seek == "M" or self.seek == "F" or self.seek == "MF",
                self.fromAge <= self.toAge
            ]
            assert(all(valid_information) == 1)
        except Exception, e:
            self.error_msg = "错误：无效提交的数据。"
        return self.error_msg




class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.render(
            "index.html",
        )

    def post(self):
        viewname = self.get_argument("viewname", default="")
        if viewname:
            self.redirect("/u/"+viewname)
        username = self.get_argument("username", default="")
        Sex = self.get_argument("Sex", default="")
        age = self.get_argument("age", default="")
        pt = self.get_argument("pt", default="")
        section = self.get_argument("section", default="")
        seek = self.get_arguments("seek")
        if isinstance(seek, list):
            seek = "".join(seek)
        fromAge = self.get_argument("fromAge", default="")
        toAge = self.get_argument("toAge", default="")
        information = [username, Sex, age, pt, section, seek, fromAge, toAge]
        user = people(information)
        error_msg = user.isvalid()
        if error_msg:
            self.render(
                "error.html",
                error_msg=error_msg,
                )
        else:
            try:
                user.write_to_file(self.request.files['file'][0])
            except KeyError:
                user.write_to_file()
            self.redirect("/u/"+username)

class MatchHandler(tornado.web.RequestHandler):
    def get(self, username):
        if username:
            read = open('files/singles.txt')
            for infor in read.readlines():
                infor = infor.strip('\n').split(',')
                if infor[0] == username:
                    information = infor
                    break
            read.close()
        try:
            user = people(information)
            error_msg = user.isvalid()
        except Exception, e:
            error_msg = "找不到该用户"
        if error_msg:
            self.render(
                "error.html",
                error_msg=error_msg,
                )
        else:
            try:
                user.write_to_file(self.request.files['file'][0])
            except KeyError:
                user.write_to_file()
            self.render(
                "results.html",
                username=username,
                matchlist=user.get_match_list(),
            )

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "files"),
    "template_path": os.path.join(os.path.dirname(__file__), 'templates'),
    "debug": True,
}

# application should be an instance of `tornado.web.Application`,
# and don't wrap it with `sae.create_wsgi_app`
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/u/(.+)", MatchHandler),
], **settings)

if __name__ == "__main__":
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()