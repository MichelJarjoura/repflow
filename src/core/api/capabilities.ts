export const optionalBackendFeaturesEnabled =
  import.meta.env.VITE_ENABLE_OPTIONAL_BACKEND_FEATURES === "true";

export const optionalBackendFeaturesMessage =
  "This area is ready in the frontend but is not enabled because the active backend does not currently expose its API routes.";
