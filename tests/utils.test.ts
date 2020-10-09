import { expect } from 'chai';
import { httpRequest } from '../src/utils';

describe('Request tests', () => {
  let response: { args: { test: string } };
  const path = '/anything';
  const params = {
    test: 'testParam'
  };
  before(async () => {
    response = await httpRequest({ path, json: true, hostname: 'httpbin.org', port: 443, method: 'GET', params });
  });

  it('Request params', () => {
    expect(response.args.test).to.eql(params.test);
  });
});
