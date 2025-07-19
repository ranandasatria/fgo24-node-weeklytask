const { PaymentMethod } = require('../models');
const { constants: http } = require('http2');


exports.createPaymentMethod = async (req, res) => {
  try {
    const { paymentName } = req.body;

    if (!paymentName || paymentName.trim() === '') {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: 'Payment method name is required'
      });
    }

    const newPayment = await PaymentMethod.create({
      paymentName: paymentName.trim()
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Payment method created successfully',
      data: newPayment
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create payment method'
    });
  }
};

exports.getAllPaymentMethods = async (req, res) => {
  try {
    const payments = await PaymentMethod.findAll();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Payment methods fetched successfully',
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
};
