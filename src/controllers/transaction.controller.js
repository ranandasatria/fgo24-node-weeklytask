const { Transaction, TransactionDetail } = require('../models');
const { constants: http } = require('http2');

exports.createTransaction = async (req, res) => {
  const t = await Transaction.sequelize.transaction();

  try {
    const userId = req.user?.id;
    const {
      movieId,
      showDate,
      showTime,
      location,
      cinema,
      totalPrice,
      paymentMethod,
      seats
    } = req.body;

    if (
      !userId || !movieId || !showDate || !showTime ||
      !location || !cinema || !totalPrice || !paymentMethod ||
      !seats || !Array.isArray(seats)
    ) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: 'Missing or invalid fields in request'
      });
    }

    const transaction = await Transaction.create({
      idUser: userId,
      idMovie: movieId,
      showDate,
      showTime,
      location,
      cinema,
      totalPrice,
      paymentMethod
    }, { transaction: t });

    const detailsData = seats.map((s) => ({
      transactionId: transaction.id,
      seat: s.seat,
      price: s.price
    }));

    const createdDetails = await TransactionDetail.bulkCreate(detailsData, {
      transaction: t,
      returning: true
    });

    await t.commit();

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        ...transaction.toJSON(),
        seats: createdDetails.map(d => ({
          seat: d.seat,
          price: d.price
        }))
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating transaction:', error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create transaction'
    });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: {
        model: TransactionDetail,
        as: 'details',
        attributes: ['seat', 'price']
      },
      order: [['createdAt', 'DESC']]
    });

    const result = transactions.map((trx) => ({
      id: trx.id,
      idUser: trx.idUser,
      idMovie: trx.idMovie,
      showDate: trx.showDate,
      showTime: trx.showTime,
      location: trx.location,
      cinema: trx.cinema,
      totalPrice: trx.totalPrice,
      paymentMethod: trx.paymentMethod,
      createdAt: trx.createdAt,
      updatedAt: trx.updatedAt,
      seats: trx.details.map((d) => ({
        seat: d.seat,
        price: d.price
      }))
    }));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'All transactions retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve transactions'
    });
  }
};