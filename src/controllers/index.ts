import * as express from 'express';

import publicExpressRoutes from '@controllers/public';
import teamMemberExpressRoutes from '@controllers/team-member';
import teamLeaderApi from '@controllers/team-leader';
import authExpressRoutes from '@controllers/auth';

function handleError(err, _, res, __) {
  console.error(err.stack);

  res.json({ error: err.message || err.toString() });
}

export default function controllers(server: express.Express) {
  server.use('/api/v1/public', publicExpressRoutes, handleError);
  server.use('/api/v1/team-member', teamMemberExpressRoutes, handleError);
  server.use('/api/v1/team-leader', teamLeaderApi, handleError);
  server.use('/api/v1/auth', authExpressRoutes, handleError);
}
