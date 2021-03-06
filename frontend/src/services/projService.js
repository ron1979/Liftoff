const BASE_URL = (process.env.NODE_ENV !== 'development') ? '/proj' : 'http://localhost:3000/proj';

function query(criteria = "") {
    
  criteria = flattenNestedObj(criteria);

  criteria = Object.keys(criteria)
    .map(key => key + "=" + criteria[key])
    .join("&");
  return axios
    .get(BASE_URL + "?" + criteria)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("No Projs", err));
}

function flattenNestedObj(obj) {
  return Object.assign(
    {},
    ...(function _flatten(obj) {
      return [].concat(
        ...Object.keys(obj).map(
          key =>
            typeof obj[key] === "object"
              ? _flatten(obj[key])
              : { [key]: obj[key] }
        )
      );
    })(obj)
  );
}

function saveProj(proj) {
  if (proj._id) return axios.put(_getProjUrl(proj._id), proj);
  else return axios.post(BASE_URL, proj);
}

function deleteProj(projId) {
  return axios.delete(_getProjUrl(projId));
}

function getById(projId) {
  return axios.get(_getProjUrl(projId)).then(res => res.data);
}

function updateFundsRaised(proj) {
  return axios.put(`${BASE_URL}/updateFundsRaised`, proj).then(res => res.data);
}

function _getProjUrl(projId) {
  return `${BASE_URL}/${projId}`;
}

export default {
  query,
  saveProj,
  deleteProj,
  getById,
  updateFundsRaised
};
