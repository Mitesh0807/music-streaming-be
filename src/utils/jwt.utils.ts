import jwt, { SignOptions } from "jsonwebtoken";

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAw8pOm9cs8FCaxFrjNOM3PdoRLz6RAeCM6siu1bDUWG+Cls0a
xw/6RTpZlK3CFUFrRyfIuLkfM2VCq5L++p2KMUJU6XfpNt6piNd8nK5BUnKDBozB
Edv5KoX5gwGHpvQOU1/KY70Ij69AQEuyneVuKvMo8BUsETFfRdaVRpnKaqtguBJI
GW1wFplOdLzZizCh+3chSZChnNKOTuNmBV+i585LUzZrLjrIIKxl/KpKndJv5+eB
4SWhFC2r9XqvlIA/aT5WsLdYysJhG46S5I/L+JBdLT+oN6hZJiaR6N5FgODAFTId
Xth45VQU5RAj2ShwbHi8uZyUHLlCloG19tHJkQIDAQABAoIBAQCgPUIKz5eq8v1H
uO79SPzcNU4dMYKyW5pZSXe10qxn2JOzYhgJVW1KHVBVm8Qda1YmfUwMyw3bHYPs
MjlW2XrRh+1Ayu/nBWMRaPNGtGMn3CqaQLZ/LF6Hy/CCpMzl+haDbAGTkZGhLxhR
xuJf0fdRVYNqwpk3VQYZfV7c0l9U3o9Z5EO/AQLDW5/vTsJxRQ3tBpligFRU9RFr
vQI/dp9mG75aeYDWc7ZlZbJjWltP5bFIuCxRyfdEcxCJn7N1RQgcmxsigePqb1Q4
43KccSwAE+US1VrWKrGIKXmvxIj2aMZFH1ZYz2pZP3JjgnLZjpNYO8TS2oOIy7GG
WtDwonOFAoGBAPp/MecPk7OnT3aTwZuBNRZyAomaA9tBXZcUe390mVo1cHaLe/Cw
n3r2Rs/kX64Arkx+j2mfOC79ie96VP+FHgRLtcND+w52fWkCocxSRxfjM5c+yasi
guKvNk6YmFdoZbLmLEYnO/dgFngeEFSHL3GoG5XfKbvwvpQRcmUgeNJjAoGBAMgX
cJ2UmjwYsrD4mUut+XfL0HU4f3gP/epVOOmJZ+qVK6SJEkwFy+xEZ0vG6UbBGEbo
6PWXuivCRggM+F6POewvInehMYmcSkhtgD0/jFFlAcwx2ePiZi3NxnfRePPtpBve
wpWm+NcahXMusIz0PLK7ag6luLslkrCcKxBF7Lx7AoGBAOJk2NYq9uP0v9W8fsur
gC50BiUU5I1hy1NDOMadvAeSqr0JHZAQIWMBeEhl76+Uf/M0oyrjsuSNUv/0QSPa
zKE3R+Rd6WZN4tRog5Dlf8lwF22HWr7n5wE3N87bDTxaZyfD7ZnN1d2io0wWZ83t
jAyd0ainU9G/KI8sIYaSTYBfAoGBAI9J2ee/B0SKG00Ieh7sE35qgnmvX/lG2nr5
VKxJLhWbhYlqb6PpcsNbqO1nIJ7+oLgHCuz1Huk/Uo9pWmO9BanRh0lMMgFt3vRH
FlLGM2IGh2cHPBYphyq99abQZ2GniKI8v/QTgpfn8jEt+li2ftEvzR94JfY/TfET
pPMeYA4JAoGARuxSHj5/pcXQDhsH3WYY0TAuVPb8oscZdQxj3Z0wtsaQ4lH99oVJ
A7Mx7fNWCSq2DmuFLaR2kHMFkS07CzYYMM8HKeZgxgAg6qF1Xt5u7DC8VG+yKVPm
H4TMSvKHyvOuhWtdpn76tr5zH/me+3WDzxKbkb9kT9o0Ek32llMQ+aQ=
-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw8pOm9cs8FCaxFrjNOM3
PdoRLz6RAeCM6siu1bDUWG+Cls0axw/6RTpZlK3CFUFrRyfIuLkfM2VCq5L++p2K
MUJU6XfpNt6piNd8nK5BUnKDBozBEdv5KoX5gwGHpvQOU1/KY70Ij69AQEuyneVu
KvMo8BUsETFfRdaVRpnKaqtguBJIGW1wFplOdLzZizCh+3chSZChnNKOTuNmBV+i
585LUzZrLjrIIKxl/KpKndJv5+eB4SWhFC2r9XqvlIA/aT5WsLdYysJhG46S5I/L
+JBdLT+oN6hZJiaR6N5FgODAFTIdXth45VQU5RAj2ShwbHi8uZyUHLlCloG19tHJ
kQIDAQAB
-----END PUBLIC KEY-----`;

interface JwtPayload {
  [key: string]: any;
}

interface VerifyJwtResult {
  valid: boolean;
  expired: boolean;
  decoded: JwtPayload | null;
}

function signJwt(
  object: JwtPayload,
  options?: SignOptions
): string | undefined {
  try {
    return jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  } catch (error) {
    console.error("Error signing JWT:", error);
  }
}

function verifyJwt(token: string): VerifyJwtResult {
  try {
    const decoded = jwt.verify(token, publicKey) as JwtPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error("Error verifying JWT:", e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

export { signJwt, verifyJwt };
