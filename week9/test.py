
read = open('files/singles.txt', 'a+')
record = read.read()

print [i.split(",") for i in record.split("\n")]