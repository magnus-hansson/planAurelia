import {inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {ApiService} from './services/apiService';
import moment from 'moment';
import vis from  'vis';
import 'vis/dist/vis.css!';
import {DialogService} from 'aurelia-dialog';

@inject(ApiService, BindingEngine, DialogService, vis)
export class PlanChart {
    constructor(apiService, bindingEngine, dialogService) {
        this.apiService = apiService;
        this.activities = [];
        this.guides = [];
        this.allGuides = [];
        this.dialogService = dialogService;
        this.timeline = null;
    }

    filterGuides() {
        //antingen kan vi från this.timeline.itemsData._data se vad som hänt, eller så uppdaterar vi this.activities när nåt händer och sätter den som dirty
        let filterd = this.allGuides.filter(g => g.id > 50 || g.id == 1);
        this.timeline.setGroups(filterd);
        console.log(filterd);
    }

    attached() {

        var container = document.getElementById('visualization');

        // Configuration for the Timeline
        var options = {
            template: function (item) {
                return '<p class="small" title="' + moment(item.start).format('YYYY-MM-DD') + ' - ' + moment(item.end).format('YYYY-MM-DD') +   '">' + item.tripName + ' (' + item.group +  ')</p>';
            },
            editable: {
                add: false,         // add new items by double tapping
                updateTime: false,  // drag items horizontally
                updateGroup: true, // drag items from one group to another
                remove: false       // delete an item by tapping the delete button top right
            },
            onMove: (item, callback) => {
                console.log('move trip', item.tripName, moment(item.start).format('YYYY-MM-DD'), moment(item.end).format('YYYY-MM-DD'), 'to guide with id:', item.group);
                let updatedItem = this.activities.find(itm => itm.id == item.id);
                updatedItem.group = item.group;
                updatedItem.dirty = true;
                console.log(this.activities);
                item.start = moment(item.start).format('YYYY-MM-DD HH:mm');
                item.end = moment(item.end).format('YYYY-MM-DD HH:mm');
                item.starttime = moment(item.start).format('HH:mm');
                item.endtime = moment(item.end).format('HH:mm');

                callback(item); // send back item as confirmation (can be changed)
            }
        };

        const groups = [
            { id: 1, content: 'Unassigned' },
            { id: 14, content: 'Agneta Wåxberg' },
            { id: 4, content: 'Sinikka Veivo' }
        ]
        
        this.apiService.getTrips()
            .then((res) => {
                console.log('feed', res);
                this.activities = res;

                this.apiService.getGuides()
                    .then((guides) => {
                        this.allGuides = guides;
                        var timeline = new vis.Timeline(container);
                        timeline.setOptions(options);
                        timeline.setGroups(this.allGuides);
                        timeline.setItems(this.activities);
                        this.timeline = timeline;
                    });
            });
    }
}