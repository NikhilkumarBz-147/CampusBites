const pool = require("./promiseDb");

async function initSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS favorite_items (
            user_id INT NOT NULL,
            item_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, item_id),
            CONSTRAINT fk_favorite_items_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_favorite_items_item
                FOREIGN KEY (item_id) REFERENCES menu_items(id)
                ON DELETE CASCADE
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS item_ratings (
            user_id INT NOT NULL,
            item_id INT NOT NULL,
            rating TINYINT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, item_id),
            CONSTRAINT chk_item_ratings_rating
                CHECK (rating BETWEEN 1 AND 5),
            CONSTRAINT fk_item_ratings_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_item_ratings_item
                FOREIGN KEY (item_id) REFERENCES menu_items(id)
                ON DELETE CASCADE
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_activity (
            user_id INT NOT NULL,
            shop_id INT NOT NULL,
            clicks INT NOT NULL DEFAULT 0,
            last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, shop_id),
            CONSTRAINT fk_user_activity_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_user_activity_shop
                FOREIGN KEY (shop_id) REFERENCES shops(id)
                ON DELETE CASCADE
        )
    `);
}

module.exports = initSchema;
