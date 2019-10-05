import { Injectable, CanActivate, ExecutionContext, HttpService, UnauthorizedException, HttpException, HttpStatus, Catch } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly httpService: HttpService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return new Observable<boolean>((observer) => {
            const request = context.switchToHttp().getRequest();
            this.httpService.get('http://localhost:3100/v1/users/current',
                { headers: { Authorization: request.headers.authorization } })
                .subscribe(
                    (data) => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        observer.error(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
                    }
                );
        })
    }
}