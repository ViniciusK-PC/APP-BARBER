import bcrypt from "bcryptjs";
import { databaseReady, get, insert, run, transaction } from "./db.js";

await databaseReady;

const hasAdmin = await get<{ id: string }>("SELECT id FROM users WHERE email = ?", ["admin@barbe.local"]);

if (!hasAdmin) {
  const password = bcrypt.hashSync("Admin@123", 10);

  await transaction(async client => {
    const adminId = await insert(
      "INSERT INTO users (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)",
      ["Rafael Monteiro", "admin@barbe.local", password, "(11) 99999-1000", "admin"],
      client
    );
    const barberUserId = await insert(
      "INSERT INTO users (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)",
      ["Lucas Barbeiro", "profissional@barbe.local", password, "(11) 99999-2000", "professional"],
      client
    );
    const professionalId = await insert(
      "INSERT INTO professionals (user_id,nickname,bio,commission_rate,color) VALUES (?,?,?,?,?)",
      [barberUserId, "Lucas", "Especialista em cortes clássicos e barba.", 45, "#C9A96E"],
      client
    );
    const serviceCat = await insert(
      "INSERT INTO categories (name,type) VALUES (?,?)",
      ["Barbearia", "service"],
      client
    );
    const productCat = await insert(
      "INSERT INTO categories (name,type) VALUES (?,?)",
      ["Cuidados", "product"],
      client
    );
    const serviceIds = [];
    serviceIds.push(await insert(
      "INSERT INTO services (category_id,name,description,duration_minutes,price,cost,commission_rate,loyalty_points) VALUES (?,?,?,?,?,?,?,?)",
      [serviceCat, "Corte Premium", "Corte personalizado com acabamento.", 45, 65, 8, 45, 10],
      client
    ));
    serviceIds.push(await insert(
      "INSERT INTO services (category_id,name,description,duration_minutes,price,cost,commission_rate,loyalty_points) VALUES (?,?,?,?,?,?,?,?)",
      [serviceCat, "Barba Terapia", "Toalha quente, modelagem e hidratação.", 30, 45, 6, 45, 8],
      client
    ));
    serviceIds.push(await insert(
      "INSERT INTO services (category_id,name,description,duration_minutes,price,cost,commission_rate,loyalty_points) VALUES (?,?,?,?,?,?,?,?)",
      [serviceCat, "Corte + Barba", "Experiência completa de corte e barba.", 75, 100, 12, 45, 18],
      client
    ));
    for (const serviceId of serviceIds) {
      await run(
        "INSERT INTO professional_services (professional_id,service_id) VALUES (?,?)",
        [professionalId, serviceId],
        client
      );
    }
    for (const day of [1, 2, 3, 4, 5, 6]) {
      await run(
        "INSERT INTO work_hours (professional_id,weekday,start_time,end_time,break_start,break_end) VALUES (?,?,?,?,?,?)",
        [professionalId, day, "09:00", day === 6 ? "17:00" : "19:00", "12:00", "13:00"],
        client
      );
    }
    await run(
      "INSERT INTO products (category_id,name,description,sku,price,cost,stock,min_stock) VALUES (?,?,?,?,?,?,?,?)",
      [productCat, "Pomada Matte", "Fixação alta com acabamento natural.", "POM-MAT-01", 49.9, 21, 18, 5],
      client
    );
    await run(
      "INSERT INTO products (category_id,name,description,sku,price,cost,stock,min_stock) VALUES (?,?,?,?,?,?,?,?)",
      [productCat, "Óleo para Barba", "Hidratação e fragrância amadeirada.", "OLE-BAR-01", 39.9, 16, 9, 4],
      client
    );
    await run(
      "INSERT INTO products (category_id,name,description,sku,price,cost,stock,min_stock) VALUES (?,?,?,?,?,?,?,?)",
      [productCat, "Shampoo 3 em 1", "Cabelo, barba e corpo.", "SHA-3X1-01", 34.9, 14, 3, 5],
      client
    );
    await run(
      "INSERT INTO settings (key,value) VALUES (?,?)",
      ["business", JSON.stringify({
        name: "Barbearia Monteiro",
        slogan: "Tradição, estilo e cuidado.",
        primaryColor: "#C9A96E",
        address: "Av. Central, 450 — Centro",
        phone: "(11) 3333-4455"
      })],
      client
    );
    console.log(`Neon inicializado. Admin ${adminId}; profissional ${professionalId}.`);
  });
} else {
  console.log("Neon já inicializado.");
}
