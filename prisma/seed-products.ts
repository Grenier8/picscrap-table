import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "DJI",
      },
    }),
    prisma.brand.create({
      data: {
        name: "CANON",
      },
    }),
    prisma.brand.create({
      data: {
        name: "SIGMA",
      },
    }),
  ]);

  const brandsId = {
    DJI: brands[0].id,
    CANON: brands[1].id,
    SIGMA: brands[2].id,
  };

  //BaseProducts
  const baseProducts = await Promise.all([
    prisma.baseProduct.create({
      data: {
        name: "Estabilizador DJI Osmo Mobile 7P",
        link: "https://picslabstore.cl/estabilizador-dji-osmo-mobile-7p",
        price: 199990,
        brandId: brandsId["DJI"],
        sku: "1000009061",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/60281130/resize/306/306?1739884710",
      },
    }),
    prisma.baseProduct.create({
      data: {
        name: "Cámara Mirrorless Canon EOS R5 Mark II - Body",
        link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r5-mark-ii-body",
        price: 5199990,
        brandId: brandsId["CANON"],
        sku: "6536C003",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/51477920/resize/306/306?1723045107",
      },
    }),
    prisma.baseProduct.create({
      data: {
        name: "Lente Sigma 56mm f/1.4 DC DN Contemporary - Fuji X",
        link: "https://picslabstore.cl/lente-sigma-56mm-f/14-dc-dn-contemporary-fuji-x",
        price: 498990,
        brandId: brandsId["SIGMA"],
        sku: "SG20269",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/30117871/resize/306/306?1670600713",
      },
    }),
  ]);

  const baseProductId = {
    "1000009061": baseProducts[0].id,
    "6536C003": baseProducts[1].id,
    SG20269: baseProducts[2].id,
  };

  //Products
  await Promise.all([
    prisma.product.create({
      data: {
        name: "Estabilizador DJI Osmo Mobile 7P",
        link: "https://picslabstore.cl/estabilizador-dji-osmo-mobile-7p",
        price: 199990,
        sku: "1000009061",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/60281130/resize/306/306?1739884710",
        brandId: brandsId["DJI"],
        webpageId: 1,
        baseProductId: baseProductId["1000009061"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Cámara Mirrorless Canon EOS R5 Mark II - Body",
        link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r5-mark-ii-body",
        price: 5199990,
        sku: "6536C003",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/51477920/resize/306/306?1723045107",
        brandId: brandsId["CANON"],
        webpageId: 1,
        baseProductId: baseProductId["6536C003"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Lente Sigma 56mm f/1.4 DC DN Contemporary - Fuji X",
        link: "https://picslabstore.cl/lente-sigma-56mm-f/14-dc-dn-contemporary-fuji-x",
        price: 498990,
        sku: "SG20269",
        image:
          "https://cdnx.jumpseller.com/picslab-store/image/30117871/resize/306/306?1670600713",
        brandId: brandsId["SIGMA"],
        webpageId: 1,
        baseProductId: baseProductId["SG20269"],
      },
    }),

    prisma.product.create({
      data: {
        name: "DJI OSMO MOBILE 7P SMARTPHONE GIMBAL CON SEGUIMIENTO",
        link: "https://davidandjoseph.cl/index.php?route=product/product&product_id=57080&search=&description=true&page=34",
        price: 199990,
        outOfStock: false,
        sku: "1000009061",
        image:
          "https://davidandjoseph.cl/image/cache/catalog/DJI/1000009061-250x250.jpg",
        brandId: brandsId["DJI"],
        webpageId: 4,
        baseProductId: baseProductId["1000009061"],
      },
    }),
    prisma.product.create({
      data: {
        name: "DJI Osmo Mobile 7P",
        link: "https://rinconfotografico.cl/dji-osmo-mobile-7p",
        price: 189991,
        outOfStock: true,
        sku: "1000009061",
        image:
          "https://cdnx.jumpseller.com/rincon-fotografico/image/60111027/resize/610/610?1739454408",
        brandId: brandsId["DJI"],
        webpageId: 2,
        baseProductId: baseProductId["1000009061"],
      },
    }),

    prisma.product.create({
      data: {
        name: "Canon EOS R5 Mark II Mirrorless",
        link: "https://apertura.cl/tienda/canon/4780812-canon-eos-r5-mark-ii-mirrorless-.html",
        price: 5199990,
        outOfStock: true,
        sku: "6536C003",
        image:
          "https://apertura.cl/tienda/47153-large_default/canon-eos-r5-mark-ii-mirrorless-.jpg",
        brandId: brandsId["CANON"],
        webpageId: 3,
        baseProductId: baseProductId["6536C003"],
      },
    }),

    prisma.product.create({
      data: {
        name: "Sigma 56mm f/1.4 DC DN Contemporary Lente para FUJIFILM X",
        link: "https://apertura.cl/tienda/lentes-para-fujifilm/4881-sigma-56mm-f14-dc-dn-contemporary-lente-para-fujifilm-x.html",
        price: 499900,
        outOfStock: true,
        sku: "SG20269",
        image:
          "https://apertura.cl/tienda/29927-large_default/sigma-56mm-f14-dc-dn-contemporary-lente-para-fujifilm-x.jpg",
        brandId: brandsId["SIGMA"],
        webpageId: 3,
        baseProductId: baseProductId["SG20269"],
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
