import { Request, Response } from 'express';
import { controller, post, get } from './decorators';
import { ParticipantControllerBackEnd } from '../convector';

@controller('/participant')
export class Participant {
  @get('/users')
  private getUsers = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getAllUsers());
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @get('/users/:id')
  private getUserDetails = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getUserDetails(params.id));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @post('/users/register')
  private registerUser = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(await ParticipantControllerBackEnd.registerUser(params.user));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };


  @get('/agents')
  private getAgents = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getAllAgents());
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @get('/agents/:id')
  private getAgentDetails = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getAgentDetails(params.id));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @post('/agents/register')
  private registerAgent = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(await ParticipantControllerBackEnd.registerAgent(params.agent));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };


  @get('/agency')
  private getAgencies = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getAllAgencies());
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @get('/agency/:id')
  private getAgencyDetails = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await ParticipantControllerBackEnd.getAgencyDetails(params.id));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
  @post('/users/register')
  private registerAgency = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(await ParticipantControllerBackEnd.registerUser(params.agency));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };

}
