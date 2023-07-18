import { expect } from 'chai';
import { httpRequest } from '../src/utils';

describe('Request tests', () => {
  let response: { args: { test: string } };
  const path = '/get';
  const params = {
    test: 'testParam'
  };
  before(async function() {
    this.timeout(10000)
    response = await httpRequest({ path, json: true, hostname: 'postman-echo.com', port: 443, method: 'GET', params });
  });

  it('Request params', () => {
    expect(response.args.test).to.eql(params.test);
  });
});
