export const config = {
    api_base_url: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8000/api/',
    auth_route: "auth",
    managers_route: "managers",
    mission_type_route: "mission_types",
};
