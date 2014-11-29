#coding:utf-8
"""
13331093
黄雄镖
已实现ex1-ex5
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
import re


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
        for people in match_list:
            if self.fromAge <= people.age <= self.toAge and people.fromAge <= self.age <= people.toAge:
                people.rate += 1
            if self.OS == people.OS:
                people.rate += 2
            people.rate += len(set(people.pt) & set(self.pt))
            if people.name == self.name or people.seek.find(self.sex) == -1 or self.seek.find(people.sex) == -1 or people.rate < 3:
                continue
            matched_list.append(people)
        return matched_list

    def write_to_file(self):
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
            for i in valid_information:
                print i
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
        username = self.get_argument("name", default="")
        if username:
            read = open('files/singles.txt')
            for infor in read.readlines():
                infor = infor.strip('\n').split(',')
                if infor[0] == username:
                    information = infor
                    break
            read.close()
        else:
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

            file = self.request.files['file'][0]
            filename = username.lower().replace(" ", "_")+"."+file["filename"].split(".")[-1]
            f = open("files/images/%s" % filename, "wb")
            f.write(file["body"])
            f.close()

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

        user.write_to_file()

        # if 'errormsg' in vars():
        #     self.render(
        #         "error.html",
        #         errormsg=errormsg
        #     )
        # else:
        #     read = open('data.txt', 'a+')
        #     record = read.read()
        #     read.close()
        #     information[2] = information[2].replace("-", "")
        #     cards = cardId.replace("-", "") + "(" + card + ")"
        #     if record.find(cardId.replace("-", "")) == -1:
        #         read = open('data.txt', 'a+')
        #         read.write(";".join(information)+"\n")
        #         read.close()
        #         read = open('data.txt', 'a+')
        #         record = read.read()
        #         read.close()
        #     self.render(
        #         "sucker.html",
        #         username=username,
        #         section=section,
        #         card=cards,
        #         record=record
        #     )
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

], **settings)

if __name__ == "__main__":
    application.listen(663)
    tornado.ioloop.IOLoop.instance().start()