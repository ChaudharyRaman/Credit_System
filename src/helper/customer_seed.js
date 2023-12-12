const prisma = require("./prisma");

const csv = require("csv-parser");
const fs = require("fs");
const results = [];

async function seed() {
  try {
    await prisma.user.deleteMany();
    fs.createReadStream("./customer_data.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // console.log(results);
        results.forEach((result) => {
          prisma.user
            .create({
              data: {
                id: result.id,
                customer_id: parseInt(result.customer_id),
                first_name: result.first_name,
                last_name: result.last_name,
                age: parseInt(result.age),
                phone_number: result.phone_number,
                monthly_salary: parseInt(result.monthly_salary),
                approved_limit: parseInt(result.approved_limit),
              },
            })
            // .then((data) => console.log(data))
            .catch((error) => console.log(error));
        });
      });

    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed();
