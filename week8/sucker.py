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


class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.render(
            "buyagrade.html",
        )

    def post(self):
        username = self.get_argument("username", default="")
        section = self.get_argument("section", default="")
        cardId = self.get_argument("cardId", default="")
        card = self.get_argument("card", default="")
        information = [username, section, cardId, card]
        if not all(information):
            errormsg = "Your didn't fill out the form completely."
        elif self.check(cardId, card):
            errormsg = "Your didn't provide a valid card number."
        if 'errormsg' in vars():
            self.render(
                "error.html",
                errormsg=errormsg
            )
        else:
            read = open('data.txt', 'a+')
            record = read.read()
            read.close()
            information[2] = information[2].replace("-", "")
            cards = cardId.replace("-", "") + "(" + card + ")"
            if record.find(cardId.replace("-", "")) == -1:
                read = open('data.txt', 'a+')
                read.write(";".join(information)+"\n")
                read.close()
                read = open('data.txt', 'a+')
                record = read.read()
                read.close()
            self.render(
                "sucker.html",
                username=username,
                section=section,
                card=cards,
                record=record
            )

    def check(self, cardId, card):
        pat = "^\d{16}$|^(\d{4}-){3}\d{4}$"  # only match case dddd*4 or dddd-*3+dddd
        m = re.match(pat, cardId)
        if m:
            cardId = m.group().replace("-", "")
        else:
            return 1
        if card == "visa" and cardId[0] != "4" or card == "mastercard" and cardId[0] != "5" or\
            reduce(lambda x, y: int(x)+int(y), reduce(lambda x, y: x+str((int(y)*2)) if y < "5" else x+str(int(y)*2%10+int(y)*2/10), "0"+cardId[::2]) + cardId[1::2])%10:  # Luhn
            return 1
        return 0

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "moviefiles"),
    "template_path": os.path.join(os.path.dirname(__file__), 'templates'),
    "debug": True,
}

# application should be an instance of `tornado.web.Application`,
# and don't wrap it with `sae.create_wsgi_app`
application = tornado.web.Application([
    (r"/", MainHandler),
], **settings)

if __name__ == "__main__":
    application.listen(88)
    tornado.ioloop.IOLoop.instance().start()