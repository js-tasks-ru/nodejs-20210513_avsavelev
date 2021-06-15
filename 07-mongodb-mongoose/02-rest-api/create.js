const Category = require('./models/Category');
const Product = require('./models/Product');
// const connection = require('../libs/connection');
// const mongoose = require('mongoose');
//  const ObjectId = mongoose.Types.ObjectId;

(async () => {
  await Category.deleteMany();
  await Product.deleteMany();

  category = await Category.create({
    title: 'Category1',
    subcategories: [{
      title: 'Subcategory1',
    }],
  });

  product = await Product.create({
    title: 'Product1',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[0].id,
    images: ['image1'],
  });
})();

// process.exit(0);
