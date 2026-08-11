import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services';
import { FileHelperService } from '../_helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  students: any;
  page;
  pageSize;
  currentPageSize = 25;
  collectionSize;
  isAdmin;
  constructor(private router: Router,
    private alertService$: ToastrService,
    private studentService$: StudentService,
    private fileService$: FileHelperService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {  
    this.route.queryParamMap.subscribe(path => {
      const tabParam = path.get('tab');
      if (tabParam === "admin") {
        this.isAdmin = true;
      }
    });
    this.getStudentList(); 
  }

  onPageChange(page) {
    this.getStudentList(page);
  }

  async getStudentList(page=1) {     

    this.students = await this.studentService$.getList(page);
    if(this.students){
      this.collectionSize =  this.students.totalCount;
      this.page = (this.students.currentPage) ? this.students.currentPage: 1;
      this.pageSize =  this.students.perPage;
      this.currentPageSize = this.pageSize * (page - 1);
    }
  }

  OnView(_id) {
    this.router.navigate([`/dashboard/application/${_id}`]);
  }

  flatten (obj, path = '') {        
    if (!(obj instanceof Object)) return {[path.replace(/\.$/g, '')]:obj};
    return Object.keys(obj).reduce((output, key) => {
        return obj instanceof Array ? 
             {...output, ...this.flatten(obj[key], path +  '[' + key + '].')}:
             {...output, ...this.flatten(obj[key], path + key + '.')};
    }, {});
  }

  async OnExport() {
    const students = await this.studentService$.getAll();
    const flattenData = students.map(data => {      
      const { uploadotherdocuments, uploadphotosignature, _id, __v, ...dataToExport } = data;
      return this.flatten(dataToExport);
    });
    this.fileService$.downloadFile(flattenData);
  }

  async generateRollNo() {
    const response = await this.studentService$.generateRollNumber();
    this.alertService$.success(response.message, 'SUCCESS');
  }
}
