// Simple validation helpers shared by controllers.

/**
 * Checks that every field name in `fields` exists on `body` and is not
 * empty/undefined/null. Returns an array of missing field names.
 */
const getMissingFields = (body, fields) => {
  return fields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });
};

/**
 * Parses a route param into a positive integer ID.
 * Returns null if the param is not a valid positive integer.
 */
const parseId = param => {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

module.exports = { getMissingFields, parseId };
