export const CONFIGS = {
  IS_MOCK_API: import.meta.env.VITE_I8N_LOCALE === "1" ? true : false,
  ACCESS_TOKEN_COOKIE_NAME: "_vsl_atk",
  ID_TOKEN_COOKIE_NAME: "_vsl_itk",
  REFRESH_TOKEN_COOKIE_NAME: "_vsl_rtk",
};
