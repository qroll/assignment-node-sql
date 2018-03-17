# assignment-node-sql

Link to the app: [rollplays.me:9000](http://rollplays.me:9000)
- http://rollplays.me:9000/api/register
- http://rollplays.me:9000/api/commonstudents
- http://rollplays.me:9000/api/suspend
- http://rollplays.me:9000/api/retrievefornotifications

### Data values
Id is ommitted for brevity

`teachers` table

email |
--- |
penelope.fitts@example.com |
jessica.whitwell@example.com |
j.stroud@example.com |

`students` table

email | isSuspended
--- | ---
lucy.carlyle@gmail.com | false
anthony.lockwood@gmail.com | false
george.cubbins@gmail.com | false
john.mandrake@gmail.com | false
jane.farrar@gmail.com | false
rebecca.piper@gmail.com | false

`registration` table

teacher | student
--- | ---
penelope.fitts@example.com | lucy.carlyle@gmail.com
penelope.fitts@example.com | george.cubbins@gmail.com
jessica.whitwell@example.com | john.mandrake@gmail.com
jessica.whitwell@example.com | jane.farrar@gmail.com
j.stroud@example.com | lucy.carlyle@gmail.com
j.stroud@example.com | john.mandrake@gmail.com
