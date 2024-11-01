import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required!" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user!" });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id: id as string },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }

      res.status(200).json(user);
    } else {
      const users = await prisma.user.findMany();

      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to list users" });
  }
};
