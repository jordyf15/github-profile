import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import licenseIcon from "../../assets/icons/Chield_alt.svg";
import forkIcon from "../../assets/icons/Nesting.svg";
import searchIcon from "../../assets/icons/Search.svg";
import starIcon from "../../assets/icons/Star.svg";
import heroImg from "../../assets/images/hero-image-github-profile.jpg";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Scaled } from "../../constants";
import dependencies from "../../dependencies";
import ErrorResponse from "../../models/error";
import { Repository } from "../../models/repository";
import { User } from "../../models/user";

type RequestStatus =
  | "requesting"
  | "success"
  | "failed"
  | "not-yet-request"
  | "not-found";

const HomePage = () => {
  const [requestUserStatus, setRequestUserStatus] =
    useState<RequestStatus>("requesting");
  const [requestAllRepoStatus, setRequestAllRepoStatus] =
    useState<RequestStatus>("not-yet-request");
  const [user, setUser] = useState<User>();
  const [userRepos, setUserRepos] = useState<Repository[]>([]);
  const [requestAllRepo, setRequestAllRepo] = useState<boolean>(false);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [searchUserRequestStatus, setSearchUserRequestStatus] =
    useState<RequestStatus>("not-yet-request");
  const [searchUser, setSearchUser] = useState<User>();

  useEffect(() => {
    (async () => {
      try {
        const fetchedUser =
          await dependencies.usecases.user.searchUserByUsername("github");
        setUser(fetchedUser);
        const fetchedRepos =
          await dependencies.usecases.repository.getUserRepos("github", 4);
        setUserRepos(fetchedRepos);
        setRequestUserStatus("success");
      } catch (err) {
        setRequestUserStatus("failed");
        console.log(err);
      }
    })();
  }, []);

  const onChangeSearchBar = (newSearchBarValue: string) => {
    setSearchBarValue(newSearchBarValue);
  };

  const onSearch = async () => {
    setSearchUserRequestStatus("requesting");
    try {
      const newUser = await dependencies.usecases.user.searchUserByUsername(
        searchBarValue
      );
      setSearchUser(newUser);
      setSearchUserRequestStatus("success");
    } catch (err) {
      try {
        const errorResponse = err as ErrorResponse;
        switch (errorResponse.status) {
          case "404":
            setSearchUserRequestStatus("not-found");
            break;
          default:
            setSearchUserRequestStatus("failed");
            console.log(err);
            break;
        }
      } catch (error) {
        setSearchUserRequestStatus("failed");
        console.log(error);
      }
    }
  };

  const onViewSearchedUser = async () => {
    try {
      const newUser = searchUser as User;
      setRequestUserStatus("requesting");
      setRequestAllRepoStatus("not-yet-request");
      setUser(newUser);
      const fetchedRepos = await dependencies.usecases.repository.getUserRepos(
        newUser.login,
        4
      );
      setUserRepos(fetchedRepos);
      setRequestAllRepo(false);
      setSearchBarValue("");
      setSearchUserRequestStatus("not-yet-request");
      setSearchUser(undefined);
      setRequestUserStatus("success");
    } catch (err) {
      setRequestUserStatus("failed");
      console.log(err);
    }
  };

  const onCancelViewSearchUser = () => {
    setSearchUserRequestStatus("not-yet-request");
    setSearchUser(undefined);
  };

  const onClickViewAllRepo = () => {
    (async () => {
      setRequestAllRepo(true);
      setRequestAllRepoStatus("requesting");

      if (user) {
        const fetchedAllRepos =
          await dependencies.usecases.repository.getUserRepos(user.login);
        setUserRepos(fetchedAllRepos);
        setRequestAllRepoStatus("success");
      }
    })();
  };

  return (
    <Stack minHeight="100vh" minWidth="100vw" bgcolor="background.default">
      <Box
        height={{ xs: "35vh", md: "30vh" }}
        width={1}
        sx={{
          background: `url(${heroImg}) center center/cover no-repeat`,
        }}
      />
      <Stack
        alignItems="center"
        position="absolute"
        top={{ xs: "20px", md: "30px" }}
        width={1}
        spacing={1}
      >
        <TextField
          value={searchBarValue}
          onChange={(e) => onChangeSearchBar(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearch();
              e.preventDefault();
            }
          }}
          sx={{
            maxWidth: "500px",
            width: 1,
            ".MuiInputBase-root": {
              mx: { xs: "30px", sm: "0" },
              bgcolor: "background.default",
              borderRadius: "10px",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="img"
                    onClick={(e) => {
                      onSearch();
                      e.preventDefault();
                    }}
                    src={searchIcon}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
        {searchUserRequestStatus === "failed" && (
          <Stack
            alignItems="center"
            px={{ xs: "30px", sm: "0" }}
            width={1}
            maxWidth={1}
            boxSizing="border-box"
          >
            <Stack
              bgcolor="background.paper"
              justifyContent="center"
              alignItems="center"
              width={1}
              maxWidth="500px"
              borderRadius="10px"
              py={2}
            >
              <Typography
                fontSize={{ xs: Scaled.rem(12), md: Scaled.rem(16) }}
                textAlign="center"
                color="text.primary"
              >
                Something wrong happened. Please try again later.
              </Typography>
            </Stack>
          </Stack>
        )}
        {searchUserRequestStatus === "not-found" && (
          <Stack
            alignItems="center"
            px={{ xs: "30px", sm: "0" }}
            width={1}
            maxWidth={1}
            boxSizing="border-box"
          >
            <Stack
              bgcolor="background.paper"
              justifyContent="center"
              alignItems="center"
              width={1}
              maxWidth="500px"
              borderRadius="10px"
              py={2}
            >
              <Typography color="text.primary">User not found</Typography>
            </Stack>
          </Stack>
        )}
        {searchUserRequestStatus === "success" && searchUser && (
          <ClickAwayListener onClickAway={onCancelViewSearchUser}>
            <Stack
              alignItems="center"
              px={{ xs: "30px", sm: "0" }}
              width={1}
              maxWidth={1}
              boxSizing="border-box"
              onClick={onViewSearchedUser}
              sx={{
                cursor: "pointer",
              }}
            >
              <Stack
                borderRadius="10px"
                p={1}
                direction="row"
                bgcolor="background.paper"
                width={1}
                maxWidth="500px"
                boxSizing="border-box"
                spacing={1.5}
              >
                <Box
                  width="70px"
                  borderRadius="10px"
                  component="img"
                  src={searchUser.avatarUrl}
                />
                <Stack overflow="hidden" spacing={0.5} justifyContent="center">
                  <Typography
                    color="text.primary"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {searchUser.login}
                  </Typography>
                  <Typography
                    fontSize={Scaled.rem(12)}
                    color="text.secondary"
                    maxHeight="32px"
                  >
                    {searchUser.bio}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </ClickAwayListener>
        )}
        {searchUserRequestStatus === "requesting" && (
          <Stack
            alignItems="center"
            px={{ xs: "30px", sm: "0" }}
            width={1}
            maxWidth={1}
            boxSizing="border-box"
          >
            <Stack
              bgcolor="background.paper"
              justifyContent="center"
              alignItems="center"
              width={1}
              maxWidth="500px"
              borderRadius="10px"
              py={2}
            >
              <LoadingSpinner text="Fetching data..." />
            </Stack>
          </Stack>
        )}
      </Stack>

      <Stack position="relative" zIndex={3} flexGrow={1} height={1}>
        {requestUserStatus === "requesting" && (
          <Stack justifyContent="center" alignItems="center" flexGrow={1}>
            <LoadingSpinner text="Fetching data..." />
          </Stack>
        )}
        {requestUserStatus === "success" && user && (
          <Stack
            sx={{
              mx: { lg: "150px", md: "100px", sm: "60px", xs: "30px" },
            }}
            flexGrow={1}
            spacing={4}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "normal", md: "flex-end" }}
              spacing={{ md: 4 }}
            >
              <Box
                component="img"
                src={user.avatarUrl}
                width={{ md: "100px", xs: "75px" }}
                border="5px solid #20293A"
                borderRadius="15px"
                position="relative"
                top={{ xs: "-30px", md: "-40px" }}
              />
              <Stack
                direction={{ md: "row" }}
                alignItems="flex-start"
                spacing={{ xs: 2 }}
                position="relative"
                top={{ md: "-45px" }}
              >
                <AccountDataChip
                  text="Followers"
                  data={user.followers.toString()}
                />
                <AccountDataChip
                  text="Following"
                  data={user.following.toString()}
                />
                <AccountDataChip text="Location" data={user.location} />
              </Stack>
            </Stack>
            <Stack mt={{ md: "0px !important" }} spacing={1}>
              <Typography
                fontSize={{ xs: Scaled.rem(24), lg: Scaled.rem(28) }}
                color="text.primary"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {user.login}
              </Typography>
              <Typography
                fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
                color="text.primary"
              >
                {user.bio}
              </Typography>
            </Stack>
            {userRepos.length > 0 ? (
              <Grid spacing={4} container>
                {userRepos.map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </Grid>
            ) : (
              <Stack justifyContent="center" alignItems="center" flexGrow={1}>
                <Typography textAlign="center" color="text.primary">
                  User have no repositories
                </Typography>
              </Stack>
            )}
            <Stack alignItems="center" pb={3}>
              {!requestAllRepo && userRepos.length === 4 && (
                <Button
                  variant="text"
                  sx={{
                    color: "text.primary",
                    textTransform: "none",
                  }}
                  onClick={onClickViewAllRepo}
                >
                  View all repositories
                </Button>
              )}
            </Stack>

            {requestAllRepoStatus === "requesting" && (
              <Stack
                justifyContent="center"
                alignItems="center"
                flexGrow={1}
                pb={3}
              >
                <LoadingSpinner text="Fetching data..." />
              </Stack>
            )}
          </Stack>
        )}
        {requestUserStatus === "failed" && (
          <Stack justifyContent="center" alignItems="center" flexGrow={1}>
            <Typography textAlign="center" color="text.primary">
              Something wrong happened.
              <br /> Please try again later.
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

interface RepositoryCardProps {
  repo: Repository;
}

const RepositoryCard = ({ repo }: RepositoryCardProps) => {
  const parseUpdatedAtToLastUpdatedAt = (updatedAt: string): string => {
    let lastUpdatedAt = "";
    let timeDifference = 0;
    const updatedAtDate = Date.parse(updatedAt);
    const currentDate = Date.now();
    const differentDate = Math.abs(currentDate - updatedAtDate);

    if (differentDate > 1000 * 60 * 60 * 24 * 30 * 12) {
      //more than a year
      timeDifference = Math.floor(
        differentDate / (1000 * 60 * 60 * 24 * 30 * 12)
      );
      lastUpdatedAt = `updated ${timeDifference} year${
        timeDifference > 1 ? "s" : ""
      } ago`;
    } else if (differentDate > 1000 * 60 * 60 * 24 * 30) {
      // more than a month
      timeDifference = Math.floor(differentDate / (1000 * 60 * 60 * 24 * 30));
      lastUpdatedAt = `updated ${timeDifference} month${
        timeDifference > 1 ? "s" : ""
      } ago`;
    } else if (differentDate > 1000 * 60 * 60 * 24) {
      // more than a day
      timeDifference = Math.floor(differentDate / (1000 * 60 * 60 * 24));
      lastUpdatedAt = `updated ${timeDifference} day${
        timeDifference > 1 ? "s" : ""
      } ago`;
    } else if (differentDate > 1000 * 60 * 60) {
      // more than an hour
      timeDifference = Math.floor(differentDate / (1000 * 60 * 60));
      lastUpdatedAt = `updated ${timeDifference} hour${
        timeDifference > 1 ? "s" : ""
      } ago`;
    } else if (differentDate > 1000 * 60) {
      // more than a minute
      timeDifference = Math.floor(differentDate / (1000 * 60));
      lastUpdatedAt = `updated ${timeDifference} minute${
        timeDifference ? "s" : ""
      } ago`;
    } else if (differentDate > 1000) {
      //more than a second
      timeDifference = Math.floor(differentDate / 1000);
      lastUpdatedAt = `updated ${timeDifference} second${
        timeDifference ? "s" : ""
      } ago`;
    } else {
      lastUpdatedAt = "updated 1 second ago";
    }

    return lastUpdatedAt;
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Link underline="none" target="_blank" href={repo.htmlUrl}>
        <Stack
          p={2}
          sx={{
            background:
              "linear-gradient(90deg,rgba(17, 23, 41, 1) 0%, rgba(29, 27, 72, 1) 100%);",
          }}
          borderRadius="10px"
          spacing={2}
        >
          <Typography
            fontSize={{ xs: Scaled.rem(16), lg: Scaled.rem(18) }}
            color="text.primary"
          >
            {repo.name}
          </Typography>
          <Typography
            fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
            color="text.secondary"
          >
            {repo.description}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {repo.license && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box width="20px" component="img" src={licenseIcon} />
                  <Typography
                    fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
                    color="text.secondary"
                  >
                    {repo.license.spdxId}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box width="20px" component="img" src={forkIcon} />
                <Typography
                  fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
                  color="text.secondary"
                >
                  {repo.forksCount}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box width="20px" component="img" src={starIcon} />
                <Typography
                  fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
                  color="text.secondary"
                >
                  {repo.stargazersCount}
                </Typography>
              </Stack>
            </Stack>

            <Typography
              fontSize={{ xs: Scaled.rem(10), lg: Scaled.rem(12) }}
              color="text.secondary"
            >
              {parseUpdatedAtToLastUpdatedAt(repo.updatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </Link>
    </Grid>
  );
};

interface AccountDataChipProps {
  text: string;
  data: string;
}

const AccountDataChip = ({ text, data }: AccountDataChipProps) => {
  return (
    <Stack
      direction="row"
      bgcolor="background.paper"
      py={1}
      px={2}
      borderRadius="10px"
      spacing={2}
    >
      <Typography
        fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
        color="text.primary"
      >
        {text}
      </Typography>
      <Box bgcolor="background.default" width="2px" />
      <Typography
        fontSize={{ xs: Scaled.rem(12), lg: Scaled.rem(14) }}
        color="text.primary"
      >
        {data}
      </Typography>
    </Stack>
  );
};

export default HomePage;
