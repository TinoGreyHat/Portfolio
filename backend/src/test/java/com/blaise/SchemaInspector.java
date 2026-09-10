package com.blaise;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class SchemaInspector {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "Shalom13";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("=== TABLES IN POSTGRES DATABASE ===");
            ResultSet tables = conn.getMetaData().getTables(null, null, "%", null);
            int count = 0;
            while (tables.next()) {
                String schemaName = tables.getString("TABLE_SCHEM");
                if ("pg_catalog".equals(schemaName) || "information_schema".equals(schemaName)) continue;
                String tableName = tables.getString("TABLE_NAME");
                System.out.println("Table: " + schemaName + "." + tableName);
                count++;
            }
            System.out.println("Total custom tables: " + count);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
