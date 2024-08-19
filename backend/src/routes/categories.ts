import express from "express";
import { connection } from "../server/database";
import Category from "../models/category";
import Event from "../models/event";
import Joi from "joi";

const router = express.Router();

const categorySchema = Joi.object().keys({
  category_name: Joi.string().required(),
  description: Joi.string().required(),
});

router.post('/add', async (req, res) => {
  const result = categorySchema.validate(req.body);
  if (result.error) {
      res.status(422).json({
          success: false,
          msg: `Validation err: ${result.error.details[0].message}`,
      });
      return;
  }
  const { category_name, description } = req.body;
  try {
      const categoryRepository = connection!.getRepository(Category);

      const c = new Category();
      c.category_name = category_name;
      c.description = description;

      const category = await categoryRepository.save(c)
      res.status(201).json(category)

  } catch (error) {
      res.status(500).json({ msg: "Error", error })
  }
});

router.put('/edit/:id', async (req, res) => {

  const result = categorySchema.validate(req.body);
  if (result.error) {
      res.status(422).json({
          success: false,
          msg: `Validation err: ${result.error.details[0].message}`,
      });
      return;
  }

  const { category_name, description } = req.body;
  const category_id = req.params.id;

  try {
      const categoryRepository = connection!.getRepository(Category);

      const category = await categoryRepository.findOne(category_id);
      if (!category) {
          res.status(404).json({ success: false, msg: "Category not found" });
          return;
      }

      category.category_name = category_name;
      category.description = description;
      const updatedCategory = await categoryRepository.save(category);
      res.status(200).json(updatedCategory);

  } catch (error) {
      res.status(500).json({ msg: "Error", error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const category_id = req.params.id;

  try {
      const categoryRepository = connection!.getRepository(Category);
      const eventRepository = connection!.getRepository(Event);

      const category = await categoryRepository.findOne(category_id);
      if (!category) {
          res.status(404).json({ success: false, msg: "Category not found" });
          return;
      }

      const eventCount = await eventRepository.count({ where: { category } });
      if (eventCount > 0) {
          res.status(400).json({ success: false, msg: "Cannot delete category with associated events" });
          return;
      }

      await categoryRepository.remove(category);
      res.status(200).json({ success: true, msg: "Category deleted successfully" });

  } catch (error) {
      res.status(500).json({ msg: "Error", error });
  }
});

router.get('/', (_req, res) => {
    const CategoryRepository = connection!.getRepository(Category);
  
    CategoryRepository.find().then((category) => {
      res.json(category);
    }).catch((err) => {
      console.error('Error fetching category:', err);
      res.status(500).json({ error: 'Error fetching category' });
    });
  });


export default router;
