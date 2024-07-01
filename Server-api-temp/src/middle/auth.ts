const jwt = require("jsonwebtoken");

const auth = async (
  req: { header: (arg0: string) => any; user: any; token: any },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { msg?: string; error?: unknown }): void; new (): any };
    };
  },
  next: () => void
) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = auth;
