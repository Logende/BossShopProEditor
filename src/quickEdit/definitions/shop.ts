export default {
    title: "Shop",
    type: "object",
    $id: "shop.ts",
    properties: {
        name: { type: "string" },
        signtext: { type: "string" },
        commands: { type: "array", items: { type: "string" } },
        items: { $ref: "itemList.ts" }
    }
};
