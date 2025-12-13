import Favorite from '../models/Favorite.js'
import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const favorites = await Favorite.find({ user: userId })
    .populate('product', 'name brand price image category stock inStock description ingredients usage rating numReviews')
    .sort({ createdAt: -1 })

  // Filter out products that are not active
  const activeFavorites = favorites.filter(fav => fav.product && fav.product.isActive !== false)

  res.json({
    success: true,
    count: activeFavorites.length,
    data: activeFavorites.map(fav => ({
      _id: fav.product._id,
      name: fav.product.name,
      brand: fav.product.brand,
      price: fav.product.price,
      originalPrice: fav.product.originalPrice,
      image: fav.product.image || (fav.product.images && fav.product.images[0]),
      images: fav.product.images || [],
      category: fav.product.category,
      description: fav.product.description,
      ingredients: fav.product.ingredients,
      usage: fav.product.usage,
      rating: fav.product.rating || 0,
      reviews: fav.product.numReviews || 0,
      stock: fav.product.stock || 0,
      inStock: fav.product.inStock !== false && (fav.product.stock || 0) > 0,
      favoriteId: fav._id
    }))
  })
})

// @desc    Add product to favorites
// @route   POST /api/favorites
// @access  Private
export const addToFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.body
  const userId = req.user._id

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp ID sản phẩm'
    })
  }

  // Check if product exists
  const product = await Product.findById(productId)
  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Sản phẩm không tồn tại'
    })
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({ user: userId, product: productId })
  if (existingFavorite) {
    return res.status(400).json({
      success: false,
      message: 'Sản phẩm đã có trong danh sách yêu thích'
    })
  }

  const favorite = await Favorite.create({
    user: userId,
    product: productId
  })

  await favorite.populate('product', 'name brand price image category stock inStock')

  res.status(201).json({
    success: true,
    message: 'Đã thêm vào danh sách yêu thích',
    data: {
      _id: favorite.product._id,
      name: favorite.product.name,
      brand: favorite.product.brand,
      price: favorite.product.price,
      image: favorite.product.image || (favorite.product.images && favorite.product.images[0]),
      category: favorite.product.category,
      stock: favorite.product.stock || 0,
      inStock: favorite.product.inStock !== false && (favorite.product.stock || 0) > 0,
      favoriteId: favorite._id
    }
  })
})

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
export const removeFromFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const userId = req.user._id

  const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId })

  if (!favorite) {
    return res.status(404).json({
      success: false,
      message: 'Sản phẩm không có trong danh sách yêu thích'
    })
  }

  res.json({
    success: true,
    message: 'Đã xóa khỏi danh sách yêu thích'
  })
})

// @desc    Check if product is in favorites
// @route   GET /api/favorites/check/:productId
// @access  Private
export const checkFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const userId = req.user._id

  const favorite = await Favorite.findOne({ user: userId, product: productId })

  res.json({
    success: true,
    isFavorite: !!favorite,
    favoriteId: favorite ? favorite._id : null
  })
})


