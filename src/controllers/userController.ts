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
    const saltRounds = process.env.SALT_ROUNDS
      ? parseInt(process.env.SALT_ROUNDS)
      : 5;
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

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: id as string },
    });

    return res.json({ message: "User deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name, email, password } = req.body;

  const dataToUpdate: any = {};

  const saltRounds = process.env.SALT_ROUNDS
    ? parseInt(process.env.SALT_ROUNDS)
    : 5;

  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (password) dataToUpdate.password = await bcrypt.hash(password, saltRounds);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: dataToUpdate,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Cannot update user!" });
  }
};
