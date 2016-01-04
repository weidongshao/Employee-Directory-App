BACKEND='http://rancher1.huaweim2m.com:3000';

config = {
  API: BACKEND+'/api/employees',
  IMAGE: BACKEND+'/public/pics/'
};

module.exports = config;
