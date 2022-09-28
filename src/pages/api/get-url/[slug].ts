import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query["slug"] || req.query.slug;
  console.log(slug);

  if (!slug || typeof slug !== "string") {
    res.statusCode = 404;
    return res.send(JSON.stringify({ message: "Invalid slug" }));
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Acess-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "s-maxage=1000000000, stale-while-revalidate")
    return res.send(
      JSON.stringify({ message: "URL not found, please use a valid slug" }),
    );
  }

  return res.json(data);
};
