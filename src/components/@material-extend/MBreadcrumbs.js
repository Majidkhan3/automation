import { last } from "lodash";
import PropTypes from "prop-types";
// next
import NextLink from "next/link";
// material
import { Typography, Box, Link, Breadcrumbs } from "@mui/material";

// ----------------------------------------------------------------------

LinkItem.propTypes = {
  link: PropTypes.object,
};

function LinkItem({ link }) {
  const { href, name, icon } = link;
  return (
    <Link
      component={NextLink}
      key={name}
      href={href}
      passHref
      variant="body2"
      sx={{
        lineHeight: 2,
        display: "flex",
        alignItems: "center",
        color: themColor.primary,
        "& > div": { display: "inherit" },
      }}
    >
      {icon && (
        <Box
          sx={{
            mr: 1,
            "& svg": { width: 20, height: 20 },
          }}
        >
          {icon}
        </Box>
      )}
      {name}
    </Link>
  );
}

MBreadcrumbs.propTypes = {
  links: PropTypes.array.isRequired,
  activeLast: PropTypes.bool,
};

export default function MBreadcrumbs({ links, activeLast = false, ...other }) {
  const currentLink = last(links).name;

  const listDefault = links.map((link) => (
    <LinkItem key={link.name} link={link} />
  ));
  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 260,
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "text.disabled",
            textOverflow: "ellipsis",
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <Breadcrumbs separator="›" {...other}>
      {activeLast ? listDefault : listActiveLast}
    </Breadcrumbs>
  );
}
