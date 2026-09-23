async function run() {
    const adminUrl = "http://localhost:3000/admin-api";
    
    // 1. Login
    const loginRes = await fetch(adminUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `mutation { login(username: "superadmin", password: "superadmin") { ... on CurrentUser { id } } }`
        })
    });
    const authToken = loginRes.headers.get("vendure-auth-token");
    const cookie = loginRes.headers.get("set-cookie");
    console.log("Logged in, token:", authToken ? "yes" : "no", "cookie:", cookie ? "yes" : "no");

    const gql = async (query, variables = {}) => {
        const res = await fetch(adminUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...(authToken ? { "vendure-auth-token": authToken, "Authorization": `Bearer ${authToken}` } : {}),
                ...(cookie ? { "Cookie": cookie } : {})
            },
            body: JSON.stringify({ query, variables })
        });
        return res.json();
    };

    // 2. Create Facets
    const facetsToCreate = [
        {
            name: "Craft & Textile",
            code: "textile-craft",
            values: [
                { name: "Muslin Jamdani", code: "muslin-jamdani" },
                { name: "Mulberry Silk", code: "mulberry-silk" },
                { name: "Chanderi Zari", code: "chanderi-zari" },
                { name: "Handspun Khadi", code: "handspun-khadi" },
                { name: "Kantha Stitch", code: "kantha-stitch" },
                { name: "Katan Brocade", code: "katan-brocade" },
            ]
        },
        {
            name: "Silhouette",
            code: "silhouette",
            values: [
                { name: "Saree & Drape", code: "saree-drape" },
                { name: "Kurta & Tunic", code: "kurta-tunic" },
                { name: "Tailored Outerwear", code: "tailored-outerwear" },
                { name: "Stole & Scarf", code: "stole-scarf" },
            ]
        },
        {
            name: "Palette",
            code: "atelier-palette",
            values: [
                { name: "Alabaster & Gold", code: "alabaster-gold" },
                { name: "Indigo Noir", code: "indigo-noir" },
                { name: "Royal Ochre", code: "royal-ochre" },
                { name: "Raw Terracotta", code: "raw-terracotta" },
            ]
        }
    ];

    const createdFacetValues = {};

    for (const f of facetsToCreate) {
        console.log("Creating facet:", f.name);
        const facetRes = await gql(`
            mutation CreateFacet($input: CreateFacetInput!) {
                createFacet(input: $input) {
                    id
                    name
                    code
                    values {
                        id
                        name
                        code
                    }
                }
            }
        `, {
            input: {
                code: f.code,
                isPrivate: false,
                translations: [{ languageCode: "en", name: f.name }],
                values: f.values.map(v => ({
                    code: v.code,
                    translations: [{ languageCode: "en", name: v.name }]
                }))
            }
        });

        if (facetRes.data?.createFacet) {
            for (const v of facetRes.data.createFacet.values) {
                createdFacetValues[v.code] = v.id;
            }
        } else {
            console.log("Facet result or already exists:", JSON.stringify(facetRes.errors || facetRes));
        }
    }

    // Also get all facet values just in case
    const allFacets = await gql(`query { facets { items { code values { id code name } } } }`);
    for (const f of allFacets.data?.facets?.items || []) {
        for (const v of f.values) {
            createdFacetValues[v.code] = v.id;
        }
    }

    console.log("Facet Values Map:", createdFacetValues);

    // 3. Assign facet values to products
    const productAssignments = [
        {
            name: "Dhakai Geometric Muslin Jamdani Saree",
            facets: ["muslin-jamdani", "saree-drape", "alabaster-gold"]
        },
        {
            name: "Nocturne Indigo Jamdani Khadi Kurta",
            facets: ["handspun-khadi", "kurta-tunic", "indigo-noir"]
        },
        {
            name: "Royal Chanderi Gold Tissue Zari Saree",
            facets: ["chanderi-zari", "saree-drape", "alabaster-gold"]
        },
        {
            name: "Tangail Heritage Silk Jamdani Scarf",
            facets: ["muslin-jamdani", "stole-scarf", "royal-ochre"]
        },
        {
            name: "Kolkata Artisanal Kantha Stitch Raw Silk Stole",
            facets: ["kantha-stitch", "stole-scarf", "raw-terracotta"]
        },
        {
            name: "Bengal Handloom Raw Mulberry Silk Sherwani",
            facets: ["mulberry-silk", "tailored-outerwear", "indigo-noir"]
        },
        {
            name: "Cross-Border Dual-Origin Handspun Linen Overcoat",
            facets: ["handspun-khadi", "tailored-outerwear", "raw-terracotta"]
        },
        {
            name: "Varanasi Pure Katan Silk Brocade Dupatta",
            facets: ["katan-brocade", "stole-scarf", "royal-ochre"]
        }
    ];

    const prods = await gql(`query { products(options: { take: 50 }) { items { id name } } }`);
    for (const p of prods.data?.products?.items || []) {
        const match = productAssignments.find(a => a.name.toLowerCase() === p.name.toLowerCase());
        if (match) {
            const fvIds = match.facets.map(c => createdFacetValues[c]).filter(Boolean);
            console.log(`Assigning ${match.name} (id: ${p.id}) ->`, fvIds);
            const updateRes = await gql(`
                mutation UpdateProduct($input: UpdateProductInput!) {
                    updateProduct(input: $input) {
                        id
                        name
                        facetValues { id name }
                    }
                }
            `, {
                input: {
                    id: p.id,
                    facetValueIds: fvIds
                }
            });
            console.log(`Updated ${p.name}:`, updateRes.data?.updateProduct?.facetValues?.length, "facets");
        }
    }

    // 4. Assign facets to regional channels (bangladesh: 2, india: 3, global: 5)
    for (const channelId of ["2", "3", "5"]) {
        const assignRes = await gql(`
            mutation Assign($input: AssignFacetsToChannelInput!) {
                assignFacetsToChannel(input: $input) {
                    id
                }
            }
        `, {
            input: {
                facetIds: ["5", "6", "7"],
                channelId
            }
        });
        console.log(`Assigned facets to channel ${channelId}:`, assignRes);
    }

    // 5. Reindex search
    console.log("Triggering reindex...");
    const reindexRes = await gql(`mutation { reindex { ... on Job { id state } } }`);
    console.log("Reindex job:", reindexRes);
}

run().catch(console.error);
