const Payment = require("../models/payment");
const axios = require("axios");
const WiFiVoucher = require("../models/vouchers");

const api = axios.create({
  baseURL: "https://payment.intasend.com/api/v1/payment/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ISSecretKey}`,
  },
});

const stkpush = async (req, res) => {
  const userId = req.user.details._id;
  const { amount, phone_number } = req.body;
  const endpoint = "mpesa-stk-push/";

  try {
    const response = await api.post(endpoint, {
      amount,
      phone_number,
    });

    const {
      id,
      invoice,
      customer,
      payment_link,
      customer_comment,
      refundable,
      created_at,
      updated_at,
    } = response.data;

    const paymentData = {
      userId,
      id,
      invoice,
      customer,
      payment_link,
      customer_comment,
      refundable,
      created_at,
      updated_at,
    };

    const payment = await Payment.create(paymentData);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const webhookTrigger = async (req, res) => {
  try {
    const { invoice_id, state, failed_reason, failed_code, account, value } =
      req.body;

    console.log(req.body);

    if (
      failed_reason === "Request cancelled by user" ||
      failed_reason ===
        "Failed to initiate transaction. Ensure your phone is on and sim card updated. Dial *234*1*6# from your Safaricom sim card to update it and try again."
    ) {
      return (
        (console.log("failed"),
        await axios.post("https://sms.textsms.co.ke/api/services/sendsms/", {
          apikey: "9d97e98deaa48d145fec88150ff28203",
          partnerID: "7848",
          message: `Apologies for the inconvenience faced during your attempt to purchase the ClassicsNetPro package. Kindly contact us @ 0740315545 for immediate assistance.`,
          shortcode: "TextSMS",
          mobile: account,
        })),
        res.send("done")
      );
    }

    let voucher;

    const sendCode = async (code) => {
      console.log("sms starting transaction");

      const message = `Voucher: ${code.code}
Speed: ${code.speed}Mbps
Validity: ${code.validity}
Bandwidth: ${code.bandwidth}

Enjoy & contact us for assistance.
Regards, Charles.`;

      const data = JSON.stringify({
        mobile: account,
        sender_name: "23107",
        service_id: 0,
        message: message,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.mobitechtechnologies.com/sms/sendsms",
        headers: {
          h_api_key:
            "22dd6700b48060c8ae97dc4c4c2363d720dbbb7802050cc7701e350e580ee052",
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      await axios.post("https://sms.textsms.co.ke/api/services/sendsms/", {
        apikey: "9d97e98deaa48d145fec88150ff28203",
        partnerID: "7848",
        message: message,
        shortcode: "TextSMS",
        mobile: account,
      });
    };

    if (state === "COMPLETE") {
      console.log(state, "state");
      if (value === "7.00") {
        voucher = await WiFiVoucher.findOneAndDelete({ validity: "hour" });
        sendCode(voucher);
      } else if (value === "19.00") {
        voucher = await WiFiVoucher.findOneAndDelete({ validity: "3hours" });
        sendCode(voucher);
      } else if (value === "1.00") {
        voucher = await WiFiVoucher.findOneAndDelete({ validity: "24hours" });
        sendCode(voucher);
      } else if (value === "20.00") {
        voucher = await WiFiVoucher.findOneAndDelete({ validity: "24hours" });
        sendCode(voucher);
      } else if (value === "30.00") {
        voucher = await WiFiVoucher.findOneAndDelete({ validity: "12hours" });
        sendCode(voucher);
      }
    }

    const filter = { "invoice.invoice_id": invoice_id };
    const update = {
      $set: {
        "invoice.state": state,
        "invoice.failed_reason": failed_reason,
        "invoice.failed_code": failed_code,
      },
    };

    const updatedPayment = await Payment.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log("code completed");

    res.status(200).json({
      message: "Payload received successfully",
      payload: req.body,
      updatedPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating payment" });
  }
};

const paymentStatus = async (req, res) => {
  const options = {
    method: "POST",
    url: "https://payment.intasend.com/api/v1/payment/status/",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-IntaSend-Public-API-Key": process.env.ISPubKey,
    },
    data: { invoice_id: req.body.invoice_id },
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred", error });
  }
};

module.exports = { webhookTrigger, stkpush, paymentStatus };
