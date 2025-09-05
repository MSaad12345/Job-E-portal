function GetRedirectUrl(user) {
  if (!user?.profileCompleted) {
    return "/profile";
  }
  if (user?.role === "jobseeker") {
    return "/home";
  }
  if (user?.role === "employer") {
    return "/dashboard";
  }
  if (user?.role === "admin") {
    return "/admin";
  }
  return "/";
}

export default GetRedirectUrl