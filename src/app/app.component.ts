import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import { HttpErrorResponse} from "@angular/common/http";
import {EmployeeService} from "./employee.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees!: Employee[];
  public editEmployee!:Employee;
  public deleteEmployee!:Employee;
  constructor(private employeeService:EmployeeService) {}
  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(){
    this.employeeService.getEmployees().subscribe(
      (response:Employee[]) => {
        this.employees = response;
      },
      (error:HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  public openModal(employee: Employee | null, mode: string) {
    const container = document.getElementById('main-container');
    if (container) {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
      if (mode === 'add') {
        button.setAttribute('data-target', '#addEmployeeModal');
      } else if (mode === 'edit' && employee != null) {
        this.editEmployee = employee;
        button.setAttribute('data-target', '#editEmployeeModal');
      } else if (mode === 'delete' && employee != null) {
        this.deleteEmployee = employee;
        button.setAttribute('data-target', '#deleteEmployeeModal');
      }
      container.appendChild(button);
      button.click();
    } else {
      console.error("Container element not found.");
    }
  }

  public onAddEmployee(addForm: NgForm){
    console.log(addForm);
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response:Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error:HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
  public onEditEmployee(employee: Employee){
    this.employeeService.updateEmployee(employee).subscribe(
      (response:Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error:HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public onDeleteEmployee(employeeId: number){
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response:void) => {
        console.log(response);
        this.getEmployees();
      },
      (error:HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key:string){
    console.log(key)
    const  result:Employee[] = [];
    for (const employee of this.employees){
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        result.push(employee);
      }
    }
    this.employees = result;
    if (result.length === 0 || !key){
      this.getEmployees();
    }
  }
}
