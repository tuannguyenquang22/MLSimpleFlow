import csv


with open("data.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        with open("insert.sql", "a") as new_file:
            new_file.write(f"INSERT INTO housing(price,area,bedrooms,bathrooms,stories,mainroad,guestroom,basement,hotwaterheating,airconditioning,parking,prefarea,furnishingstatus) VALUES ({row[0]}, {row[1]}, {row[2]}, {row[3]}, {row[4]}, '{row[5]}', '{row[6]}', '{row[7]}', '{row[8]}', '{row[9]}', {row[10]}, '{row[11]}', '{row[12]}');\n")