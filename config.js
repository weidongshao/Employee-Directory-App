BACKEND='http://kube1.huaweim2m.com:30005';

config = {
  API: BACKEND+'/api/employees',
  IMAGE: BACKEND+'/public/pics/'
};

module.exports = config;
